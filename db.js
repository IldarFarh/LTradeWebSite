import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var directorySchema = new Schema({
  title: {type: String, required: 'Title is required', unique : true},
  people: [{type: Schema.Types.ObjectId, ref: 'Person'}]
});
mongoose.model('Directory', directorySchema);

var PersonSchema = new Schema({
	directory: { 
		type: Schema.Types.ObjectId,
	    ref: 'Directory',
	    required: 'Directory is required',
	    index: {unique: false} 
		},
	name: { type: String, required: true },
    phone: String,
    email: String,
    datebirth: Date,
    post: String,
    mobphone: String
});

mongoose.model('Person', PersonSchema);

var articleSchema = new Schema({
	parent: { 
		type: Schema.Types.ObjectId,
	    ref: 'Sublevel',
	    required: 'Sublevel is required',
	    index: {unique: false} 
		},
		title: { type: String, required: true },
	    link: { type: String, required: true },
	    body: { type: String, required: true },
	    created: { type: Date, required: true },
	    tags: { type: []}
});

articleSchema.index({ body: 'text' });
mongoose.model('Article', articleSchema);

var sublevelmenuSchema = new Schema({
	parent: { 
		type: Schema.Types.ObjectId,
	    ref: 'Toplevel',
	    required: 'Toplevel is required',
	    index: {unique: false} 
		},
	title: {type: String, required: 'Title is required'},
  	link: {type: String, required: 'Link is required'},
  	articles: [{ type: Schema.Types.ObjectId, ref: 'Article',index: {unique: false} }]
});
mongoose.model('Sublevel', sublevelmenuSchema);

var toplevelmenuSchema = new Schema({
  title: {type: String, required: 'Title is required'},
  link: {type: String, required: 'Link is required'},
  sublevels: [{ 
			type: Schema.Types.ObjectId,
		    ref: 'Sublevel',
		    index: {unique: false} 
			}]
});

mongoose.model('Toplevel', toplevelmenuSchema);

const connectionString = 'mongodb://localhost/LTradeDB';
mongoose.connect(connectionString);
mongoose.connection.on("connected", () => {
    console.log("Connected to " + connectionString);
});
mongoose.connection.on("error", error => {
    console.log("Connection to " + connectionString + " failed:" + error);
});
mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from " + connectionString);
});