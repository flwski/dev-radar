const Dev = require('../Models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const { latitude, longitude, techs } = request.query;

        if (techs !== "") {

            const techsArray = parseStringAsArray(techs);

            const devs = await Dev.find({
                techs: {
                    $in: techsArray,
                },
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 80000,
                    },
                }
            });
            return response.json({ devs });
        }
        else{
            const techsArray = parseStringAsArray(techs);

            const devs = await Dev.find({               
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 80000,
                    },
                }
            });
            return response.json({ devs });
        }

       
    }
}