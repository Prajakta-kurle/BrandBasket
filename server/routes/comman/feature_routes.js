const express = require ('express')
 
const 
{addFeatureImage, 
 getFeatureImage,
 deleteFeatureImage} = require('../../controllers/comman/feature_controller');

const router = express.Router();

router.post('/add', addFeatureImage);
router.get('/get', getFeatureImage);
router.delete('/delete/:imageId', deleteFeatureImage)

module.exports = router;