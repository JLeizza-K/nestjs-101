# Lazy loading modules

By default, modules are eagerly loaded, which means that as soon as the application loads, so do all the modules, whether or not they are immediately necessary. Lazy loading can help decrease bootstrap time by loading only modules required by the specific serverless function invocation.

To load modules on-demand, Nest provides the LazyModuleLoader class that can be injected into a class in the normal way:

```typescript
@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}
}
```

"Lazy loaded" modules are cached upon the first LazyModuleLoader#load method invocation. That means, each consecutive attempt to load LazyModule will be very fast and will return a cached instance, instead of loading the module again.

```
Load "LazyModule" attempt: 1
time: 2.379ms
Load "LazyModule" attempt: 2
time: 0.294ms
Load "LazyModule" attempt: 3
time: 0.303ms
```
