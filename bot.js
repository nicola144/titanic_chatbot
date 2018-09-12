// dependencies
var restify = require('restify');
var builder = require('botbuilder');
var natural = require('natural');
var request = require('request');

// Global Array
var record = "";

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// create the bot
var bot = new builder.UniversalBot(connector);

// Listen for messages from users
server.post('/titanicbot', connector.listen());

var bot = new builder.UniversalBot(connector, function(session){
      // Echo back users text
      var msg = "Hello";
      session.send(msg);
});

// add exercise to expand - correct user - try again - this time on random word
bot.dialog('', [
    function (session, results) {
        i = 0;
        //reminder we can store variables in the session - useful for longer sessions
        session.dialogData.wordInput = results.response;
        builder.Prompts.text(session, "Please tell me your class in society: "); 

    }, function(session, results) {
        session.dialogData.wordInput = results.response;
        record = record + session.dialogData.wordInput + ',';
        builder.Prompts.text(session, "Please tell me your sex: "); 
    
    }, function(session, results) {
        session.dialogData.wordInput = results.response;
        record = record + session.dialogData.wordInput + ',';
        builder.Prompts.text(session, "Please tell me your age: "); 


    },   function(session, results) {
            session.dialogData.wordInput = results.response;
            record = record + session.dialogData.wordInput + ',';
            builder.Prompts.text(session, "Please tell me your siblings and spouses: "); 


    },    function(session, results) {
                session.dialogData.wordInput = results.response;
                record = record + session.dialogData.wordInput + ',';
                builder.Prompts.text(session, "Please tell me your parch: "); 


    }, function(session, results) {
        session.dialogData.wordInput = results.response;
        record = record + session.dialogData.wordInput + ',';
        builder.Prompts.text(session, "Please tell me your whether you paid: "); 

    }, function(session, results) {
        session.dialogData.wordInput = results.response;
        record = record + session.dialogData.wordInput + ',';
        builder.Prompts.text(session, "Please tell me your how much you embarked: "); 


    },  function (session, results) {

        record = record + results.response;
        request.post({
            url: ' http://127.0.0.1:5000/predict',
            body: record
     }, function (r1, r2) {
           response_value = r2.body;

           session.endDialog("RESPONSE BODY: "+response_value);

           session.endDialog(record);
     })
   }
        
]).triggerAction({
    matches: /^Survive$/i
});

// exercise - add help dialog

bot.dialog('help', function(session) {
    // Send message to the user and end this dialog
    session.endDialog('To talk with the bot just say Hello!');
}).triggerAction({
    matches: /^help$/,
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the dialog stack 
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});

