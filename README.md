# Node Typescript starter for RESTFul API Project

## Development

I use `node v14.15.1` for this project.
- Clone this project
- Run `yarn dev`


## Technology
- Node, Express, Typescript
- MongoDB, Mongoose
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for auth
- [Class Validator](https://github.com/typestack/class-validator) validation for classes
- [Node Bcrypt](https://github.com/kelektiv/node.bcrypt.js) for encrypting password
- [@sendgrid/mail](https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail) send mail with sengrid
- Event Dispatcher
- Testing with jest
- Eslint & Prettier
- [express-async-handler](https://github.com/Abazhenov/express-async-handler#readme) handler async routes
- [Winston](https://github.com/winstonjs/winston#readme) for logger
- Dependency Injection service with [typedi](https://github.com/typestack/typedi)

## Routes

## Structure folder

<details>
  <summary>Click to expand!</summary>
  
  ```
  ├── LICENSE
  ├── logs
  │   ├── all.log
  │   └── error.log
  ├── nodemon.json
  ├── package.json
  ├── package-lock.json
  ├── Procfile
  ├── README.md
  ├── src
  │   ├── config
  │   │   └── index.ts
  │   ├── decorators
  │   │   └── eventDispatcher.ts
  │   ├── global.d.ts
  │   ├── loaders
  │   │   ├── dependencyInjector.ts
  │   │   ├── events.ts
  │   │   ├── express.ts
  │   │   ├── index.ts
  │   │   └── mongoose.ts
  │   ├── middleware
  │   │   ├── checkIdMongo.ts
  │   │   ├── errorRequest.ts
  │   │   ├── index.ts
  │   │   ├── notFound.ts
  │   │   ├── requestLogger.ts
  │   │   ├── userAuth.ts
  │   │   └── validation.ts
  │   ├── models
  │   │   └── users.ts
  │   ├── routes
  │   │   ├── api
  │   │   │   └── user.ts
  │   │   └── index.ts
  │   ├── server.ts
  │   ├── services
  │   │   ├── mailer.ts
  │   │   └── userService.ts
  │   ├── subscribers
  │   │   ├── event.ts
  │   │   └── user.ts
  │   ├── types
  │   │   ├── appRo.ts
  │   │   ├── dependencyInjectors.ts
  │   │   ├── express.ts
  │   │   └── user.ts
  │   └── utils
  │       └── logger.ts
  ├── test
  │   └── services
  ├── tsconfig.json
  ├── yarn-error.log
  └── yarn.lock
  ```
</details>



## Reference

- [Bulletproof-nodejs - Sam Quinn](https://github.com/santiq/bulletproof-nodejs)
