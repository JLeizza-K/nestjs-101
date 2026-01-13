## Why and when you should use a dynamic module

Static modules, given the way they're declared, cant be influenced by the consuming module. This means, the module's shape and purpose cannot be modified in any way, just used.
Dynamic modules are the ones that solve this problem, since there're scenarios where you'll want to be able to adapt the module on runtime. An example can be the configuration module

### How to import a dynamic module

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [ConfigModule.register({ folder: "./config" })], //is it was static, the import would be "[ConfigModule]"
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- ConfigModule is a normal class, so we can infer that it must have a static method called register(). We know it's static because we're calling it on the ConfigModule class, not on an instance of the class. Note: this method can have any arbitrary name, but by convention we should call it either forRoot() or register().
- The register() method is defined by us, so we can accept any input arguments we like.
- We can infer that the register() method must return a module since its return value appears in the familiar imports list.

Let's assume for the moment that we know how to somehow get the options from the register() method into the ConfigService. With that assumption, we can make a few changes to the service to customize its behavior based on the properties from the options object.

```typescript
import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";
import { EnvConfig } from "./interfaces";

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const options = { folder: "./config" };

    const filePath = `${process.env.NODE_ENV || "development"}.env`;
    const envFile = path.resolve(__dirname, "../../", options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
```

Now our ConfigService knows how to find the .env file in the folder we've specified in options.
Our ConfigModule is providing ConfigService. ConfigService in turn depends on the options object that is only supplied at run-time.

what we need to do is define our options object as a provider. This will make it injectable into the ConfigService.
Example can be found in the sandbox project.

When creating a module with:

**register**, you are expecting to configure a dynamic module with a specific configuration for use only by the calling module. For example, with Nest's @nestjs/axios: HttpModule.register({ baseUrl: 'someUrl' }). If, in another module you use HttpModule.register({ baseUrl: 'somewhere else' }), it will have the different configuration. You can do this for as many modules as you want.

**forRoot**, you are expecting to configure a dynamic module once and reuse that configuration in multiple places (though possibly unknowingly as it's abstracted away). This is why you have one GraphQLModule.forRoot(), one TypeOrmModule.forRoot(), etc.

**forFeature**, you are expecting to use the configuration of a dynamic module's forRoot but need to modify some configuration specific to the calling module's needs (i.e. which repository this module should have access to, or the context that a logger should use.)

### Configurable module builder#

Nest exposes the ConfigurableModuleBuilder class that facilitates creating configurable, dynamic modules that expose async methods and lets you construct a module "blueprint" in just a few lines of code.

_config.module-definition.ts_

```typescript
import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface ConfigModuleOptions {
  folder: string;
}
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
```

And, in the module file, you modify its implementation to leverage the auto-generated ConfigurableModuleClass:

```typescript
import { Module } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { ConfigurableModuleClass } from "./config.module-definition";

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}
```
