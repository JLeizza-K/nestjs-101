At times, the application start should be delayed until one or more asynchronous tasks are completed., that's what asynchronous providers are for. 

The syntax for this is to use async/await with the useFactory syntax. The factory returns a Promise, and the factory function can await asynchronous tasks. Nest will await resolution of the promise before instantiating any class that depends on (injects) such a provider.

```typescript
{
  provide: 'ASYNC_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection(options);
    return connection;
  },
}
```
In the example above,to inyect this provider, you would use the construct @Inject('ASYNC_CONNECTION').


