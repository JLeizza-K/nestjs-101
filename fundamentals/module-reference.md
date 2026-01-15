Nest provides the ModuleRef class to navigate the internal list of providers and obtain a reference to any provider using its injection token as a lookup key.

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service;
  
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(Service); // If the instance is not found, an exception will be raised.
  }
}
```

To find a global provider you can set the stric attribute to false, this will tell Nest to search for that service outside the given module, instead of throwing an error if not found.

```typescript
this.moduleRef.get(Service, { strict: false });
```

## Resolving scoped providers

If a service is marked as Scope.TRANSIENT, NestJS must create a new instance every time someone requests it. If you used get(), Nest would not know which instance to give you, since there is no single global instance. resolve() acts as an on-demand “factory”: “Hey, Nest, generate me a new instance of this service right now.”

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService);
  }
}
```

| Característica        | `moduleRef.get()`                                           | `moduleRef.resolve()`                                                         |
| :-------------------- | :---------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Tipo de proveedor** | **Static (Default)**: Solo funciona con Singletons.         | **Scoped**: Para proveedores `TRANSIENT` o `REQUEST`.                         |
| **Sincronía**         | Es síncrono (devuelve la instancia de inmediato).           | Es **asíncrono** (devuelve una `Promise`).                                    |
| **Instancia**         | Devuelve siempre la misma instancia compartida (Singleton). | Genera una **nueva instancia** (o resuelve una específica según el contexto). |

### The special case: Request Scope

If the service were Scope.REQUEST (one for each HTTP request), resolve() even allows you to pass a context identifier to obtain the instance linked to a specific request:

```typescript
const contextId = ContextIdFactory.create();
this.moduleRef.registerRequestByContextId(request, contextId);
const service = await this.moduleRef.resolve(MyRequestService, contextId);
```

# Registering a REQUEST Provider in Manual Contexts

In NestJS, the Dependency Injection (DI) system handles the lifecycle of providers. When dealing with **Request-Scoped** providers, the behavior changes depending on whether you are in a standard HTTP flow or a manual execution flow.

### 1. The Problem: The "Undefined" Request

Under normal circumstances, when an HTTP request hits your API, NestJS automatically:

1. Creates a **Context ID**.
2. Associates the incoming request object (`req`) with the `REQUEST` provider token.

However, when you generate a **Context ID manually** (for example, inside a Cron job, a WebSocket event, or a background worker like BullMQ), you are creating a "bubble" or a **manual DI sub-tree**. In this manual sub-tree, if a service tries to use `@Inject(REQUEST)`, it will return `undefined` because there is no actual HTTP request tied to that manually created context.

### 2. The Solution: `registerRequestByContextId()`

This method allows you to "manually provide" an object to the DI system. It tells Nest: _"Within this specific sub-tree (identified by this Context ID), whenever a service asks for the `REQUEST` provider, give them this specific object."_

### 3. Step-by-Step Example

Imagine you have a service that logs activity and needs the `userId` from the "request". You want to reuse this service inside a **BullMQ Job** where no real HTTP request exists.

```typescript
// 1. Create a unique identifier for this manual process/context
const contextId = ContextIdFactory.create();

// 2. Define a "mock" request object containing the data your services expect
const mockRequest = {
  user: { id: 123 },
  ip: "192.168.1.1",
  timestamp: new Date().toISOString(),
};

// 3. REGISTER that object into that specific context
// Now, any Request-Scoped service resolved within this contextId
// will treat 'mockRequest' as the official REQUEST object.
this.moduleRef.registerRequestByContextId(mockRequest, contextId);

// 4. Resolve the service using that context
const myService = await this.moduleRef.resolve(
  MyRequestScopedService,
  contextId
);
```
