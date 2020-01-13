import express from 'express';
import bodyParser from 'body-parser';

import nodemailer from 'nodemailer';

import exphbs from 'express-handlebars';
import hbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json())


const port = 3000

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
            host: "smtp.mailtrap.io",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: '', // generated ethereal user
            pass: '' // generated ethereal password
            }
        });

        transporter.use('compile', hbs(options));

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <noreply@mailtra.io>', // sender address
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
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))