var express=require("express"),
mongoose=require("mongoose"),
methodOverride=require("method-override"),
expressSanitizer=require("express-sanitizer"),  
bodyParser=require("body-parser");
app=express();
mongoose.connect("mongoose://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	date:{type:Date,default:Date.now}
});
var blog=mongoose.model("Blog",blogSchema);
app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err)
			console.log("Error,"+err);
		else
			res.render("index",{blogs:blogs});
	});
});
app.get("/blogs/new",function(req,res){
	res.render("form");
});
app.post("/blogs",function(req, res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
	});
});
app.get("/blogs/:id",function(req, res){
	Blog.getById(req.params.id,function(err,post){
		if(err)
			res.redirect("/blogs");
		else
			res.render("show",{blog:post});
	})
});
app.edit("/blogs/:id/edit",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body); 
	Blog.findById("req.params.id",function(err,blog){
		if(err)
			res.redirect("/blogs/:id");
		else
			res.render("edit",{blog:blog})
	})
});
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,blog,function(err,update){
		if(err)
			res.redirect("/blogs/:id/edit");
		else
			res.redirect("/blogs/" + req.params.id);
	})
});
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs");
	})
})
app.listen(process.env.PORT, process.env.IP,function(){
	console.log("Server is running");
});