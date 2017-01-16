import utils from'../utils';
import express from 'express';
import mongoose from 'mongoose';
var Person = mongoose.model('Person');
var Directory = mongoose.model('Directory');
var Toplevel = mongoose.model('Toplevel');
var Sublevel = mongoose.model('Sublevel');
var Article = mongoose.model('Article');

const router = express.Router();
/*
//for cookies
router.use(( req, res, next ) => {
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;
  if( !user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }
  next();
});*/

router.get('/', (req,res) => {
	res.render('admin', {
		title: 'Admin page',
		page: "MainPage"
	});
});

router.get('/addperson', (req,res) => {
	Directory
		.find()
    .populate('people')
    .sort('title')
		.exec( (err,dir) => {
      if (err) return next(err);
			res.render('admin', {
				title: "Контакты",
				page: "addperson",
				directoryList: dir
			});
		}
	); 
});

router.post('/addperson', (req,res) => {
	Directory.findOne({title: req.body.directory})
		.exec((err,dir) => {
			new Person({
				directory: dir._id,
				name: req.body.name,
				phone: req.body.phone,
			    email: req.body.email,
			    datebirth: req.body.datebirth,
			    post: req.body.post,
			    mobphone: req.body.mobphone
				}).save((err,person) => {
					if (err) console.log(err);
          dir.people.push(person);
          dir.save(err => {if (err) console.log(err)});
          res.redirect('/admin/addperson');
				});
		});
	});

router.post('/adddir', (req,res) => {
	new Directory({
		title: req.body.title,
		people : []
	}).save((err, dir, count) => {
		if (err) console.log(err);
		res.redirect('/admin/addperson');	
	});
});
router.get(  '/deldir/:id', ( req, res, next ) => {
  Person.find({ directory: req.params.id}).remove().exec();
  Directory.findById( req.params.id, function ( err, dir ){
    dir.remove( function ( err, dir ){
      if( err ) return next( err );
      res.redirect( '/admin/addperson' );
    });
  });
});
router.get(  '/delperson/:id', ( req, res, next ) => {
  Directory.update(
        { }, 
        { $pull: { people: req.params.id } }, 
        { multi: true }, 
        next
     );
  Person.findById(req.params.id).remove().exec();
  res.redirect( '/admin/addperson' );
});

router.get('/addmenu', (req,res) => {
	Toplevel
		.find()
    .populate('sublevels')
		.exec( (err,level) => {
			if (err) return next(err);
			res.render('admin', {
				title: "Меню",
				page: "addmenu",
				menuList: level
			});
		}
	);
});

router.post('/addmenu', (req,res) => {
  if (req.body.menuType == 'Toplevel') {
    new Toplevel({
      title: req.body.title,
      link: req.body.link,
      sublevels : []
    }).save((err, dir, count) => {
      if (err) console.log(err);
      res.redirect('/admin/addmenu'); 
    });
  } else {
    Toplevel.findOne({title: req.body.parent})
      .exec((err,dir) => {
        new Sublevel({
          parent: dir._id,
          title: req.body.title,
          link: req.body.link,
          articles : []
          }).save((err,sublvl) => {
            if (err) console.log(err);
            dir.sublevels.push(sublvl);
            dir.save(err => {if (err) console.log(err)});
            res.redirect('/admin/addmenu');
          });
      });
  };
});

router.get(  '/delmenu/:id', ( req, res, next ) => {
  Sublevel.find({ parent: req.params.id}).remove().exec();
  Toplevel.findById( req.params.id, function ( err, dir ){
    dir.remove( function ( err, dir ){
      if( err ) return next( err );
      res.redirect( '/admin/addmenu' );
    });
  });
});
router.get(  '/delsubmenu/:id', ( req, res, next ) => {
  Toplevel.update(
        { }, 
        { $pull: { sublevels: req.params.id } }, 
        { multi: true }, 
        next
     );
  Sublevel.findById(req.params.id).remove().exec();
  res.redirect( '/admin/addmenu' );
});

router.get(  '/editmenu/:id', ( req, res, next ) => {
      Toplevel
        .find()
        .populate('sublevels')
        .exec( (err,level) => {
          if (err) return next(err);
          res.render('admin', {
            title: "Меню",
            page: "editmenu",
            menuList: level,
            current: req.params.id
          });
        }
      );
    });

router.post( '/updatemenu/:id',  ( req, res, next ) => {
  Toplevel.findById( req.params.id, ( err, tlevel ) => {
    if (tlevel != null) {
      tlevel.title    = req.body.title;
      tlevel.save( function ( err, tlevel, count ){
        if( err ) return next( err );
        res.redirect( '/admin/addmenu' );
      });
    } else {
      Sublevel.findById( req.params.id, ( err, slevel ) => {
        slevel.title    = req.body.title;
        slevel.save( function ( err, slevel, count ){
          if( err ) return next( err );
          res.redirect( '/admin/addmenu' );
      });
      });
    };
  });
});

router.get('/addarticle', (req,res) => {
  Toplevel
    .find()
    .populate('sublevels')
    .exec( (err,level) => {
      if (err) return next(err);
      res.render('admin', {
        title: "Меню",
        page: "addarticle",
        menuList: level
      });
    }
  );
});

router.post('/addarticle', (req,res) => {
  Sublevel.findOne({title: req.body.parent})
        .exec((err,dir) => {
          new Article({
            parent: dir._id,
            title: req.body.title,
            link: req.body.link,
            created: new Date(),
            body : req.body.description
            }).save((err,art) => {
              if (err) console.log(err);
              dir.articles.push(art);
              dir.save(err => {if (err) console.log(err)});
              res.redirect('/admin/addarticle');
            });
        });
});




/*
router.get('/todo', (req, res, next) => {
	var user_id = req.cookies ?
    req.cookies.user_id : undefined;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );
      res.render( 'index', {
          title : 'Express Todo Example',
          todos : todos
      });
    });
});

router.post( '/todo/create', ( req, res, next ) => {
  new Todo({
      user_id    : req.cookies.user_id,
      content    : req.body.content,
      updated_at : Date.now()
  }).save( function ( err, todo, count ){
    if( err ) return next( err );

    res.redirect( '/admin/todo' );
  });
});

router.get(  '/todo/destroy/:id', ( req, res, next ) => {
  Todo.findById( req.params.id, function ( err, todo ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;

    if( todo.user_id !== user_id ){
      return utils.forbidden( res );
    }

    todo.remove( function ( err, todo ){
      if( err ) return next( err );

      res.redirect( '/admin/todo' );
    });
  });
});
router.get(  '/todo/edit/:id',    ( req, res, next ) => {
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'edit', {
        title   : 'Express Todo Example',
        todos   : todos,
        current : req.params.id
      });
    });
});
router.post( '/todo/update/:id',  ( req, res, next ) => {
  Todo.findById( req.params.id, function ( err, todo ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;

    if( todo.user_id !== user_id ){
      return utils.forbidden( res );
    }

    todo.content    = req.body.content;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );

      res.redirect( '/admin/todo' );
    });
  });
});
*/



export default router;