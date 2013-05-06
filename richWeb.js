//Developed with the aid of examples from Meteor js site and twitter example from Brian Gillesies Github
Questions = new Meteor.Collection("questions");

//Questions.remove({});


if (Meteor.isClient) {
    var MAX_CHARS = 200;
    var facebookUserName = "";

    function getFacebookName(){
        //if not logged in return anonymous, else return the user's facebook name
        if (!Meteor.userId()){
            return("Anonymous");
        }else{
            var name = Meteor.user().profile.name;
            return(name);
        }
    }

    //diarmuid
    //handle user questions
    Template.compose.events({
        'submit form': function (event) {
            var $body = $('#question-body');
            event.preventDefault();
            //facebookUserName = Meteor.user().emails[0];
            Questions.insert({
                user: facebookUserName,
                body: $body.val(),
                created_at: Date(),
                name: getFacebookName(),
                commentArray: new Array( )
            });

            $body.val('');
            $('#remaining').html(MAX_CHARS);
            window.alert("Question Submited");
        },

        'keyup #question-body': function () {
            $('#remaining').html(MAX_CHARS - $('#question-body').val().length);
        }
    });
//Michael Ashe
    Template.list.events({
        'submit form': function (event) {
            Session.set("selected_question", this._id);
            var currentArray = Questions.findOne(Session.get("selected_question")).commentArray;
            var $body = document.getElementById(this._id).value;
            event.preventDefault();
            currentArray.push({
                Comment: $body,
                Author: getFacebookName()
            });
            //
            Questions.update(Session.get("selected_question"), {$set: {commentArray: currentArray}});
            $body.val('');
            window.alert("comment Submited");
        }
    });
/////////
//Diarmuid
    Template.list.selected = function () {
        return Session.equals("selected_question", this._id) ? "selected" : '';
    };

    Template.list.events({
        'click': function () {


        }
    });
////////
  
  //increments the questions upvote count upon selection
    Template.list.events({
        'click .icon-thumbs-up': function () {
            Session.set("selected_question", this._id)
            Questions.update(Session.get("selected_question"), {$inc: {upvote: 1}});
            window.alert("Question Up-Voted");
        }
    });

    //Template.list.questions = Questions.find({}, {sort: {created_at: -1}});
    //return questions
    Template.list.questions = function(){
        return Questions.find({}, {sort: {upvote: -1}});
    };

    //return comments
    Template.list.comments = function(){
        return Questions.find({}).commentArray;
    };
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        //Questions.insert({upvote: 0});
    });

}
