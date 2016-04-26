Meteor.methods({
    addComment:function(comment){
        if(this.userId){
            comment.owner = this.userId;
            comment.createdOn = new Date();
            //comment.userId = this.userId;
            return Comments.insert(comment)
        }
        return;
    },
    addEditingUser:function(docid){
        var doc, user, eusers;
        doc = Documents.findOne({_id:docid});
        if(!doc){
            return
        }
        if(!this.userId){
            return;
        }
        user = Meteor.user().profile;
        eusers = EditingUsers.findOne({docid:doc._id});
        if(!eusers){
            eusers = {
            docid:doc._id,
            users:{}
         };
        }
        
         user.lastEdit = new Date();
        eusers.users[this.userId] = user;
        EditingUsers.upsert({_id:eusers._id},eusers);
    
},
    //check if the document is private
    updateDocPrivacy:function(doc){
        console.log(doc);
        var realDoc = Documents.findOne({_id:doc._id, owner:this.userId});
        console.log("userID" +this.userId);
        console.log("real doc"+realDoc)
        if(realDoc){
            realDoc.isPrivate = doc.isPrivate;
            console.log(realDoc);
            Documents.update({_id:doc._id}, realDoc);
           
        }
    },
        //add a new document
    addDoc:function(){
        var doc;
        if(!this.userId){
            return; 
        }
        else{
            doc = {owner:this.userId, createdOn:new Date(), title:"my new doc"};
            var id = Documents.insert(doc);
            console.log("addDoc method: got an id "+id);
            return id;
        }
    }
    
});
