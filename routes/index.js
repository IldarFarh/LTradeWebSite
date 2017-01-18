import express from 'express';
import mongoose from 'mongoose';
var Toplevel = mongoose.model('Toplevel');
var Sublevel = mongoose.model('Sublevel');
var Article = mongoose.model('Article');

const router = express.Router();

//admin route
import admin from './admin';
router.use('/admin', admin);

router.get('/', (req,res) => {
	Toplevel
	.find()
    .populate('sublevels')
		.exec( (err,level) => {
			Article
			.find()
			.populate({path: 'parent',
						populate: {path: 'parent'}})
			.limit(10)
			.exec( (err,art) => {
				if (err) return next(err);
				res.render('index', {
					title: "Главная",
					menuList: level,
					artList: art
				});
			});
		}
	);
});

router.post('/searchArt',(req, res) => {
	Toplevel
	.find()
    .populate('sublevels')
		.exec( (err,level) => {
			Article
			.find({ body:{ "$regex": new RegExp(req.body.searchText, "i") }})
			.populate({path: 'parent',
						populate: {path: 'parent'}})
			.exec( (err,art) => {
				if (err) return next(err);
				res.render('index', {
					title: "Главная",
					menuList: level,
					artList: art
				});
			});
		}
	);
});




router.get('/:toplevel', (req,res) => {
	Toplevel
	.find()
    .populate('sublevels')
		.exec( (err,level) => {
			if (err) return next(err);
			Toplevel
				.findOne({link: req.params.toplevel})
				.populate({path: 'sublevels',
							populate: {path: 'articles',
												options: { limit: 5 }}})
				.exec((err,tlvl) => {
					res.render('index', {
						title: tlvl.title,
						menuList: level,
						artList: [],
						tlvl: tlvl
			});
		});
	});
});

router.get('/:toplevel/:sublevel', (req,res) => {
	Toplevel
	.find()
    .populate('sublevels')
		.exec( (err,level) => {
			Sublevel
				.findOne({link: req.params.sublevel})
				.exec((err,slvl) => {
					Article
					.find({parent: slvl._id})
					.populate({path: 'parent',
								populate: {path: 'parent'}})
					.exec( (err,art) => {
						if (err) return next(err);
						res.render('index', {
							title: slvl.title,
							menuList: level,
							artList: art
						});
					});
				});
		});
});

router.get('/:toplevel/:sublevel/:article', (req,res) => {
	Toplevel
	.find()
    .populate('sublevels')
		.exec( (err,level) => {
			Sublevel
				.findOne({link: req.params.sublevel})
				.exec((err,slvl) => {
					Article
					.find({link: req.params.article})
					.populate({path: 'parent',
								populate: {path: 'parent'}})
					.exec( (err,art) => {
						if (err) return next(err);
						res.render('index', {
							title: slvl.title,
							menuList: level,
							artList: art
						});
					});
				});
		}
	);
});

export default router;