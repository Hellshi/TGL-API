import mjml from 'mjml'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/user'
import View from '@ioc:Adonis/Core/View'

export default class ForgotPass extends BaseMailer {
  constructor(private user: User) {
    super()
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()
  public html = mjml(
    View.renderSync('emails/forgot_pass', {
      name: this.user.name,
      link: `http://localhost:3000/reset/${this.user.token}`,
    })
  ).html
  /**
   * The prepare method is invoked automatically when you run
   * "Welcome.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    message.subject('Forgot Pass').from('hell@theHell.com').to(this.user.email).html(this.html)
  }
}
