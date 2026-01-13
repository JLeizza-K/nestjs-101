Nest and Node do not follow the Multi-Threaded Stateless Model, this means there's only one process managing incoming requests. 
But there're situations where you'll handle each request in a different thread, for those situations. 

## Provider scope
A provider can have any of the following scopes: 

**DEFAULT**	A single instance of the provider is shared across the entire application. The instance lifetime is tied directly to the application lifecycle. Once the application has bootstrapped, all singleton providers have been instantiated. Singleton scope is used by default.
**REQUEST**	A new instance of the provider is created exclusively for each incoming request. The instance is garbage-collected after the request has completed processing.
**TRANSIENT** Transient providers are not shared across consumers. Each consumer that injects a transient provider will receive a new, dedicated instance.

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```
Similarly, for custom providers, set the scope property in the long-hand form for a provider registration:

```typescript
{
  provide: 'CACHE_MANAGER',
  useClass: CacheManager,
  scope: Scope.TRANSIENT,
}
```

Controllers can also have scope, which applies to all request method handlers declared in that controller.Declare controller scope with the scope property of the ControllerOptions object:
```typescript

@Controller({
  path: 'cats',
  scope: Scope.REQUEST,
})
export class CatsController {}

```

## Scope Hierarchy

The REQUEST scope bubbles up the injection chain. A controller that depends on a request-scoped provider will, itself, be request-scoped.

If a Service it's request-scoped, it's controller will also become request-scoped, as all dependents of the injected service.

Transient-scoped dependencies don't follow that pattern. If a singleton-scoped DogsService injects a transient LoggerService provider, it will receive a fresh instance of it. However, DogsService will stay singleton-scoped, so injecting it anywhere would not resolve to a new instance of DogsService. In case it's desired behavior, DogsService must be explicitly marked as TRANSIENT as well.


## Inquirer provider
If you want to get the class where a provider was constructed, for instance in logging or metrics providers, you can inject the INQUIRER token.

```typescript

import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class HelloService {
  constructor(@Inject(INQUIRER) private parentClass: object) {}

  sayHello(message: string) {
    console.log(`${this.parentClass?.constructor?.name}: ${message}`);
  }
}

```
**Keep in mind** request-scoped providers will slow down the app performance. Unless you have a specific reason to need them, you should stick to the default singleton scope. 


## Durable providers.

What happens with having a request-scoped service, it's that's easily spread around other modules (since dependency injection is vital in Nest), and that makes a request-scoped chain that quickly decreases app performance. 

**Result**: A single REQUEST-scoped provider turns your entire app into REQUEST-scoped = a performance disaster.
**With 30,000 simultaneous requests:**

Request 1 → creates Controller + TenantService + all dependencies
Request 2 → creates Controller + TenantService + all dependencies
Request 3 → creates Controller + TenantService + all dependencies
...
Request 30,000 → creates Controller + TenantService + all dependencies

= 30,000 instances of EVERYTHING
= Lots of memory
= Lots of work for the Garbage Collector
= SLOW 🐌

## The Key Insight 💡
That's where Durable providers come in handy.

The text says: “Wait… if I only have **10 clients** (tenants), why am I creating 30,000 different instances?”

**The reality:**
- You have 30,000 requests  
- But only from **10 different clients**  
- Client A makes 5,000 requests  
- Client B makes 8,000 requests  
- etc.

**What you actually need:**

NOT THIS (traditional REQUEST scope):
Request 1 (ClientA) → Instance 1
Request 2 (ClientA) → Instance 2  ← unnecessary, it’s the same client!
Request 3 (ClientB) → Instance 3
Request 4 (ClientA) → Instance 4  ← unnecessary, it’s the same client!

BUT THIS (Durable providers):
Request 1 (ClientA) → Instance A ←┐
Request 2 (ClientA) → Instance A ←┤ they reuse the same instance
Request 4 (ClientA) → Instance A ←┘
Request 3 (ClientB) → Instance B ← another instance for another client
Request 5 (ClientB) → Instance B ← they reuse this one


```typescript
import {
  HostComponentInfo,
  ContextId,
  ContextIdFactory,
  ContextIdStrategy,
} from '@nestjs/core';
import { Request } from 'express';

const tenants = new Map<string, ContextId>();
//              ^^^^^^  ^^^^^^  ^^^^^^^^^^
//              type    key     value
//              Map     tenantId → DI sub-tree ID

export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  attach(contextId: ContextId, request: Request) {
    
    const tenantId = request.headers['x-tenant-id'] as string;
    // From the request header, extract the tenant ID

    let tenantSubTreeId: ContextId;
    
    if (tenants.has(tenantId)) {
        tenantSubTreeId = tenants.get(tenantId);
    // ✅ A DI sub-tree already exists for this tenant, reuse it
    } else {
    // 🆕 First time seeing this tenant, create a new one
      tenantSubTreeId = ContextIdFactory.create();
      tenants.set(tenantId, tenantSubTreeId);
    }
    
    // If tree is not durable, return the original "contextId" object
    return (info: HostComponentInfo) =>{
      info.isTreeDurable ? tenantSubTreeId : contextId;
  }
}
```


### General Structure
This code does 3 things:

- Maintains a registry of which tenant has which DI sub-tree
- When a request arrives, decides which DI sub-tree to use
- Differentiates between durable and non-durable providers

#### Strategy class 
```typescript
export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  attach(contextId: ContextId, request: Request) {}
}
```
ContextIdStrategy is a NestJS interface that says: "Implement this attach method and I'll call it on every request"

### Summary 
Simplified Summary

- Map: Dictionary that stores "tenant → DI sub-tree ID"
- attach(): Called on each request
- Extracts tenant ID from header
- Finds or creates the DI sub-tree for that tenant
- Returns function that decides:

Durable provider → uses tenant's DI sub-tree (shared)
Non-durable provider → uses request's unique ID

Result: Durable providers are reused between requests from the same tenant, normal providers are created per request.