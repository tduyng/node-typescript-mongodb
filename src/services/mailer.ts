import {Service, Inject} from 'typedi';

@Service()
export class MailerService{
  constructor(
    @Inject('emailClient') private emailClient
  ){}

  public async SendWelcomeEmail(email: string){
    /*
    * @TODO Call Mailchip/ Sendgrid or whaterver mail service
    */

    // Add example for sending mail from mailgun
    const data = {
      from 'Excited User <me@sample.mailgun.org>',
      to: tienduy@gmail.com,
      subject: 'Hello',
      text: 'Testing from Mailgun awesome!'
    }
  }
}
