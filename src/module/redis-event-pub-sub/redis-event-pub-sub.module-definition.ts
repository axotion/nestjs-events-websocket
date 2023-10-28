import { ConfigurableModuleBuilder } from '@nestjs/common';

export class RedisEventPubSubModuleOptions {
  readonly host: string;
  readonly port: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<RedisEventPubSubModuleOptions>()
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();
