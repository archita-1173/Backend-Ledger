const nodemailer = require('nodemailer');

const transporter= nodemailer.createTransport({
    service: 'gmail',
    auth:{
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.log('Error setting up email transporter:', err);
    } else {
        console.log('Email transporter is ready to send messages');
    }   });

// Function to send email

const sendEmail=async(to,subject,text,html)=>{
try{
    const info= await transporter.sendMail({
        from: `Backend team <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
});
console.log('Message sent: %s', info.messageId);
console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}catch(err){
    console.log('Error sending email:', err);
    throw new Error('Failed to send email');
}   };

async function sendRegistrationEmail(userEmail,name){
    const subject= 'Welcome to our platform';
    const text= `Hi ${name},\n\nThank you for registering on our platform. We're excited to have you on board!`;
    const html= `<p>Hi ${name},</p><p>Thank you for registering on our platform. We're excited to have you on board!</p>`;
    await sendEmail(userEmail, subject, text, html);}


    async function sendTransactionEmail(userEmail,name,amount,toAccount){

    const subject= "Trasaction Succesful"
    const text=''
    const html=''

    await sendEmail(userEmail,subject,text,html);
    }

    async function sendTransactionFailureEmail(userEmail,name,amount,toAccount){
        const subject='Transaction Failed'
        const text=''
        const html=''

        await sendEmail(userEmail,subject,text,html);
    }

module.exports= {sendRegistrationEmail,sendTransactionEmail,sendTransactionFailureEmail};




