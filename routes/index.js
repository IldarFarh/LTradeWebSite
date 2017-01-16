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

router.get('/:toplevel/:sublevel', (req,res,next) => {
	Toplevel
	.find()
    .populate('sublevels')
		.exec( (err,level) => {
			if (err) return next(err);
			Sublevel
				.findOne({link: req.params.sublevel})
				.exec((err,slvl) => {
					if (err) return next(err);
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
		}
	);
});

export default router;