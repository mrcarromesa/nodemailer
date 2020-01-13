<h1>E-mail NodeJS</h1>

<strong>Módulo</strong>

* [Nodemailer](https://nodemailer.com/about/)
* [Handlebars](https://handlebarsjs.com/guide/#evaluation-context)
* [Node.js, Nodemailer + Express Handlebars, Express + TypeScript](https://nicholaspretorius.github.io/til0025/)

* [Configurar o handlebars](https://github.com/ericf/express-handlebars#configuration-and-defaults)

* [Express Handlebars plugin for Nodemailer](https://github.com/yads/nodemailer-express-handlebars)

* [path](https://nodejs.org/docs/latest/api/path.html#path_path_resolve_paths)

* [Mail Trap](https://mailtrap.io)

<strong>Dica</strong>

Para configurar o envio de e-mail SMTP poderá utilizar o [Mail Trap](https://mailtrap.io)

<strong>Continuando...</strong>

* Instalação:

```bash
    yarn add nodemailer
```

* Realizar o envio e e-mail:

```js
app.get('/', async (req, res) => {
    try {
            // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: '', // generated ethereal user
            pass: '' // generated ethereal password
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <>', // sender address
            to: "email@email.com, email2@email.com", // list of receivers
            subject: "Hello ok ✔", // Subject line
            text: "Hello world? ok", // plain text body
            html: "<b>Hello world?</b><i>Show!!!</i>" // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
    } catch (error) {
        console.log(error);    
    }
    res.json({ok: 'OK'});
})
```

<strong>Utilizar o Handlerbars, para utilizar template de e-mail</strong>

* Instalação ```express-handlebars```:

```bash
yarn add express-handlebars
```

* Instalação do ```nodemailer-express-handlebars```: 

```bash
yarn add nodemailer-express-handlebars
```

<strong>Como utilizar</strong>

* Crie a seguinte pastas dentro de src:

    * views/email/layouts/
    * views/email/partials/

* Dentro de views/email/layouts/ inserir o layout principal ```template.hbs```:

```html
<div>
  <!-- placeholder do template que será definido via código -->
  {{{body}}}

  <!-- include dentro de partials/ -->
  {{> footer}}
</div>
```

* Dentro de views/email/partials/ inserir o ```footer.hbs```

```html
<br />
Equipe
```

* Dentro de views/email/ inserir o arquivo ```meuemail.hbs```

```html
<p>{{message}}</p>
```

* Código para utilizar o ```nodemailer-express-handlebars```:

```js
//reference the plugin
import exphbs from 'express-handlebars';
import hbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

// conforme: https://nicholaspretorius.github.io/til0025/
app.get('/', async (req, res) => {
    const viewPath = resolve(__dirname,'views','email');

    const options = {
        viewEngine : 

            // conforme: * [Express Handlebars plugin for Nodemailer](https://github.com/yads/nodemailer-express-handlebars)
            // viewEngine (required) either the express-handlebars view engine instance or options for the view engine

            // Documentação pode parecer um pouco confusa: https://github.com/ericf/express-handlebars#configuration-and-defaults

            // mas basicamente o Express Handlebars precisa da instâcia de express-handlebars que pode ser criada conforme doc: https://github.com/ericf/express-handlebars#configuration-and-defaults
            // Basicamente como foi criado abaixo:

            exphbs.create({ 
                extname: '.hbs', // handlebars extension
                layoutsDir: resolve(viewPath,'layouts'), // location of handlebars templates
                defaultLayout: 'template', // obterá do arquivo views/email/layouts/template.hbs
                partialsDir: resolve(viewPath, 'partials'), // location of your subtemplates aka. header, footer etc
            }),
            viewPath,
            extName: '.hbs'
    };

    try {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: '', // generated ethereal user
            pass: '' // generated ethereal password
            }
        });
        

        // conforme * [Express Handlebars plugin for Nodemailer](https://github.com/yads/nodemailer-express-handlebars)

        transporter.use('compile', hbs(options));

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <emailfrom@email.com>', // sender address
            to: "email@email.com, email2@email.com", // list of receivers
            subject: "Hello ok ✔", // Subject line
            template: 'meuemail', // obterá do arquivo views/email/meuemail.hbs
            context: {
                message: 'Mensagem aqui',
                showTitle: true,
            }
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
    } catch (error) {
        console.log(error);    
    }
    res.json({ok: 'OK'});
}
```