const exp = require('express');
const app = exp();
const bp = require('body-parser');
const ehbs = require('express-handlebars');
const dbo = require('../mongoo db/db');
const ObjectID = dbo.ObjectID;



//const bodyParser = require('body-parser');

app.engine('hbs',ehbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}));
app.set('view engine', 'hbs');
app.set('veiws','views');
app.use(bp.urlencoded({}));

app.get('/',async(req,res)=>{

    let dataBase = await dbo.getDatabase();
    const collection = dataBase.collection('books');
    const cursor = collection.find({});
    let books = await cursor.toArray();
   
   

    let message = " ";
    let edit_id, edit_book;

    if(req.query.edit_id){
        edit_id = req.query.edit_id;
        edit_book = await collection.findOne({ _id: new ObjectID(edit_id)})
    }

    if(req.query.delete_id){
       await collection.deleteOne({_id: new ObjectID(req.query.delete_id)})
       return res.redirect('/?status=3');
    }

    switch (req.query.status) {
        case '1':
            message = 'Inserted succesfully!!';
            break;

            case '2':
                message = 'Updated succesfully!!';
                break;

                case '3':
                    message = 'Deleted succesfully!!';
                    break;
        default:
            break;
    }

    res.render('main',{message,books,edit_id,edit_book})

})  
app.post('/store_book',async (req,res)=>{
    let dataBase = await dbo.getDatabase();
    const collection = dataBase.collection('books');
    let books = {title:req.body.title, author: req.body.author};
    await collection.insertOne(books);
    return res.redirect('/?status=1');



    
})

app.post('/update_book/:edit_id',async (req,res)=>{
    let dataBase = await dbo.getDatabase();
    const collection = dataBase.collection('books');
    let books = {title:req.body.title, author: req.body.author};
    let edit_id = req.params.edit_id;

    await collection.updateOne({ _id:new ObjectID(edit_id)},{$set:books});
    return res.redirect('/?status=2');



    
})

app.listen(7000,()=>{
    console.log('listening man'); 
})