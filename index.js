'use-strict';
console.log("test");

 var Alexa = require("alexa-sdk");
 exports.handler = function(event, context) {
     var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'KidzStory';
     alexa.registerHandlers(handlers);
     alexa.execute();
 };
     var handlers = {
   'NewSession': function() {
    this.emit("LaunchRequest");
     },
     };
const doc = require('dynamodb-doc');

const docClient = new doc.DynamoDB();

// const docClient = new Alexa.global();
 var  Datalist = new Array();
var eventData;

 exports.handler = function(event, context, callback) {


      var params = {
                   TableName : 'KidzStory',
                   Key : {
                   Number : 1
                    }
                  }; /* params */

       docClient.getItem(params,function(error,data) {

       if (error){

                 callback(error,null);
                console.log(error);
                }
     else {
         for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        var ev = data[k];
                        eventData = {
                          Number: (ev.Number),
                           category: (ev.category),
                            q1:(ev.q1),
                             q2:(ev.q2),
                              q3:(ev.q3),
                              q4:(ev.q4),
                              q5:(ev.q5),
                              q6:(ev.q6),
                              q7:(ev.q7),
                            a1:(ev.a1),
                             a2:(ev.a2),
                              a3:(ev.a3),
                               a4:(ev.a4),
                                a5:(ev.a5),
                                 a6:(ev.a6),
                                  a7:(ev.a7),

                        }; /* event data */
                      Datalist.push(eventData);
      }  /*if data has property K */



var handlers = {
   'NewSession': function() {
    this.emit("LaunchRequest");
     },

   'LaunchRequest': function() {
     var stage = this.attributes['currentStage'];
     var level = this.attributes['currentLevel'];
     if (!stage){
    this.response.speak("Kidz fractions has questions related to fractions for kids to answer. Kidz can choose from 3 categories easy, medium and hard");
          this.response.listen("You can try choosing from : easy or medium or hard questions");
          this.response.listen("Easy or medium or hard");
          this.emit(':responseReady');
   }else {
     this.response.speak(" Choose a category from 'easy' , 'medium' or 'hard'. Say easy or medium or hard.");
          this.response.listen("You can try: easy or medium or hard");
          this.response.listen("easy or medium or hard");
          this.emit(':responseReady');
   }
    },

  'MyeasyIntent': function() {
            setUserStatus.call(this,"easy", 1);
           getPrompt.call(this,"easy", "Easy fractions Category! Ok . ");
    },

  'MymediumIntent': function() {
            setUserStatus.call(this,"medium", 1);
            getPrompt.call(this,"medium", "Medium fractions Category! Ok . ");
    },

  'MyhardIntent': function() {

         setUserStatus.call(this,"hard", 1);
         getPrompt.call(this,"hard", "Hard fractions Category! Ok . ");
    },

  'QuestionIntent': function() {
     var stage = this.attributes['currentStage'];
        getPrompt.call(this, stage , "");
    },

    'RepeatIntent': function()
      {

      var stage = this.attributes['currentStage'];

      var  speechOutput =  " Ok. ";
            getPrompt.call(this, stage ,speechOutput);
       },
   'SkipIntent': function(){
        var level = parseInt(this.attributes['currentLevel']);
        var speechOutput = "";
          this.attributes['currentLevel'] = parseInt(level) + 1;
             checkUserStatus.call(this);
       //      speechOutput += "You want to skip! Ok." + this.attributes['currentStage'] + this.attributes['currentLevel'];
       speechOutput = "You want to skip! Ok. ";
              if (this.attributes['currentStage'] == "easy" && parseInt(this.attributes['currentLevel']) == 0) {
                        speechOutput += " You completed the hard questions! Choose a category or ";
                }
             else if (this.attributes['currentStage'] == "medium" && parseInt(this.attributes['currentLevel']) == 0) {

                   speechOutput += " You completed the easy questions! Choose a category or ";
                }

            else if (this.attributes['currentStage'] == "hard" && parseInt(this.attributes['currentLevel']) == 0) {

                speechOutput += " You completed the medium questions! Choose a category or ";

                }

              speechOutput += "Say next for next question.";
              this.response.speak(speechOutput).listen("Say next.");
              this.emit(':responseReady');
    },

     'AnswerIntent': function () {
        var stage = this.attributes['currentStage'];
        console.log(stage);
        if (!stage)
        {
          this.emit("MyHelpIntent");
       } else
       {
        var level = parseInt(this.attributes['currentLevel']);
   //     var slotValues = getSlotValues(this.event.request.intent.slots);
        var givenAnswer = this.emit(':responseReady');

        var speechOutput = "";
        var correctAnswer = eventData[stage].a[level];
        var othercorrectAnswer = eventData[stage][level].o[level];


        console.log("Given",givenAnswer);
   //     console.log("Stage",stage);

     if(correctAnswer.toUpperCase() == givenAnswer.toUpperCase() || othercorrectAnswer.toUpperCase() == givenAnswer.toUpperCase())
    //  if(correctAnswer.toUpperCase() == givenAnswer.toUpperCase() || othercorrectAnswer.toUpperCase() == givenAnswer.toUpperCase() || othercorrectAnswer1.toUpperCase() == givenAnswer.toUpperCase())
      {

             // increase their level
             this.attributes['currentLevel'] = parseInt(level) + 1;
             checkUserStatus.call(this);
           speechOutput +=   "' you got it! '" + givenAnswer + "' is right. ";

            if (this.attributes['currentStage'] == "easy" && parseInt(this.attributes['currentLevel']) == 1) {

                  speechOutput += " And you completed the hard questions! Choose a category or ";
                }
             else if (this.attributes['currentStage'] == "medium" && parseInt(this.attributes['currentLevel']) == 1) {

                speechOutput += " And you completed the easy quiz! Choose a category or ";

            }
            else if (this.attributes['currentStage'] == "hard" && parseInt(this.attributes['currentLevel']) == 1) {

                speechOutput += " And you completed the medium quiz! Choose a category or ";

            }

             speechOutput += "Say next for next question or say get a fact";
            this.response.speak(speechOutput).listen("Say next.");
            this.emit(':responseReady');

          } else {      //incorrect + hint


           speechOutput =  " Try again! Here is a hint. '"
                    + eventData[stage].h[level]
                    + "'. Let's try that one again. ";
                      console.log("Not Given",givenAnswer);
            getPrompt.call(this, stage, speechOutput);
        }
       }
    },

    'HintIntent': function() {
     var stage = this.attributes['currentStage'];
        var speechOutput = "Here is a hint. '" + eventData[this.attributes['currentStage']][this.attributes['currentLevel']].hint + "'. Here it comes again, ";
        getPrompt.call(this, stage, speechOutput);
    },
    'NewGameIntent':function(){
      this.response.speak("Ok. Restarting the questions.");
      this.emit('LaunchRequest');
    },

    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak("Ok. Bye and have a great day. Check out http://www.kidzlearn<say-as interpret-as='spell-out'>.co</say-as> <break time='0.5s'/>with a z in kidz, for more educational products.");
        this.emit(':responseReady');
    },
    'MyHelpIntent' : function() {
      var stage = this.attributes['currentStage'];
      var level = this.attributes['currentLevel'];
      console.log(stage);
      if (!stage) {
        this.response.speak("Choose a category from easy, or hard, or medium");
        this.response.listen("Say easy or hard, or medium");
        this.emit(':responseReady');
            }
      else {
       this.response.speak("Choose an answer from the given choices or say repeat to repeat the question, next to move to the next question or skip to skip answering the question.");
      this.response.listen("Say repeat and choose an answer from the given choices.");
        this.emit(':responseReady');
           }
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak("Ok. Bye and have a great day. Check out http://www.kidzlearn.co for other educational products.");
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
       this.response.speak("Choose a category from the given choices easy, medium or hard");
      this.response.listen("Say easy, medium or hard");
        this.emit(':responseReady');
        this.emit('LaunchRequest');
    }
  };

   }  /* for var */


 } /* else */

 function setUserStatus(stage,level) {
      console.log("attributes user " + stage);
      this.attributes['currentStage'] = stage;
      this.attributes['currentLevel'] = level;
      console.log("attributes " + this.attributes['currentStage']);
}

 function checkUserStatus() {
    var stage = this.attributes['currentStage'];
    var level = this.attributes['currentLevel'];

    // new user
//    if(!stage || !level) {
 //       setUserStatus.call(this, "Animals", 0);
//    }

    //account for an incorrect status
    if (parseInt(level) >= eventData[stage].length) {
        if (stage=='easy')
        {
            setUserStatus.call(this, "medium", 1);
        }
        if (stage=='Capitals')
        {
            setUserStatus.call(this, "hard", 1);
        }
        if (stage == 'Places')
        {
            setUserStatus.call(this, "easy", 1);
        }
    }
}
       function getPrompt(currentStage, speechOutput)
        {
           checkUserStatus.call(this);
           var stage = this.attributes['currentStage'];
           var level = parseInt(this.attributes['currentLevel']);
  //       console.log("get prompt",stage);
           var data1 = eventData[stage].q[level];
           speechOutput = speechOutput +  data1;
           console.log("get prompt",speechOutput);
           this.response.speak(speechOutput);
          this.emit(':ask',speechOutput);

        }  /* get prompt call */

        function playScene(stage, level) {
                  var scene = eventData[stage][level].scene;
                  var speechOutput = "";
                    if (this.attributes['currentStage'] == "easy" && parseInt(this.attributes['currentLevel']) == 1) {
                        speechOutput = " You completed the hard questions!";
                        speechOutput = scene  + speechOutput + "Choose a category or say next for next question.";
                        this.response.speak(speechOutput).listen("Say easy, hard or medium or next.");
                        this.emit(':responseReady');
                     }
             else if (this.attributes['currentStage'] == "medium" && parseInt(this.attributes['currentLevel']) == 1) {

                  speechOutput = " You completed the easy questions!";
                  speechOutput = scene  + speechOutput + "Choose a category or say next for next question.";
                  this.response.speak(speechOutput).listen("Say easy, hard or medium or next.");
                   this.emit(':responseReady');
                }
            else if (this.attributes['currentStage'] == "hard" && parseInt(this.attributes['currentLevel']) == 1) {
                speechOutput = " You completed the medium questions!";
                speechOutput = scene + speechOutput + "Choose a category or say next for next question.";
                  this.response.speak(speechOutput).listen("Say easy, hard or medium or next.");
                   this.emit(':responseReady');

            } else {
 //   let audio = Quiztable[stage][level].audio;
    speechOutput =  scene + "Here comes your next question. ";
    getPrompt.call(this, stage, speechOutput);
            }
 }   /* function playscene */

/* function getSlotValues (filledSlots) {
    //given event.request.intent.slots, a slots values object so you have
    //what other ans the person said - .otherans
    //what that resolved to - .resolved
    //and if it's a word that is in your slot values - .isValidated
   let slotValues = {};

    console.log(JSON.stringify(filledSlots));

    Object.keys(filledSlots).forEach(function(item) {
       console.log("item in filledSlots: "+JSON.stringify(filledSlots[item]));
        var name=filledSlots[item].name;
//        var bb=filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name;

  //      console.log(bb);
   //     var value=filledSlots[item].value;

        if(filledSlots[item]&&
           filledSlots[item].resolutions &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) {

            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case "ER_SUCCESS_MATCH":
                    slotValues[name] = {
                        "otherans": filledSlots[item].value,
                        "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                        "isValidated": filledSlots[item].value == filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name

                    };
                    break;
                case "ER_SUCCESS_NO_MATCH":
                    slotValues[name] = {
                        "otherans":filledSlots[item].value,
                       // "resolved":"{No Answer}",
                         "resolved":filledSlots[item].value,
                        "isValidated":false
                    };
                    break;
                }
            } else {
                slotValues[name] = {
                    "otherans": filledSlots[item].value,
                 //   "resolved":filledSlots[item].value,
                   "resolved":"{No Answer}",
                    "isValidated": false
                };
            }
        },this);
       //  console.log("slot values: "+JSON.stringify(slotValues));
        return slotValues;
}  */

}); /* doc client get Item */
};
