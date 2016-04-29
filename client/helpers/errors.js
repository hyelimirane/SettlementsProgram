/**
 * Created by hyelim on 2016. 4. 29..
 */
// Local (client-only) collection
Errors = new Mongo.Collection(null);

throwError = function(message) {
    Errors.insert({message: message});
};