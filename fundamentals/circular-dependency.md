A circular dependency occurs when two classes depend on each other. 
While circular dependencies should be avoided where possible, you can't always do so. In such cases, Nest enables resolving circular dependencies between providers in two ways:

## Forward reference

A forward reference allows Nest to reference classes which aren't yet defined using the forwardRef() utility function

```typescript 

@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService)) // both sides of the relationship can use @Inject() and the forwardRef() utility to resolve the circular dependency.
    private commonService: CommonService,
  ) {}
}
```

The order of instantiation is indeterminate. Make sure your code does not depend on which constructor is called first.
This also applies to modules, not only services. 

```typescript

@Module({
  imports: [forwardRef(() => CatsModule)],
})
export class CommonModule {}

```

## ModuleRef class alternative

An alternative to using forwardRef() is to refactor your code and use the ModuleRef class to retrieve a provider on one side of the (otherwise) circular relationship.

