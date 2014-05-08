var app = null;

// Route method that tests for the existance of 'action' and then makes a
// route if it exists.
function route(method, path, action) {
  if(typeof action === "function") {
    method.call(app, path, action);
  }
}

function get(path, action) {
  route(app.get, path, action);
}

function post(path, action) {
  route(app.post, path, action);
}

function put(path, action) {
  route(app.put, path, action);
}

function del(path, action) {
  route(app.del, path, action);
}

module.exports.resource = function(path, controller) {
  get(path, controller.index);
  get(path + '/new', controller.new);
  post(path, controller.create);
  get(path + '/:id', controller.show);
  get(path + '/:id/edit', controller.edit);
  put(path + '/:id', controller.update);
  del(path + '/:id', controller.delete);
};

module.exports.init = function(appRef) {
  app = appRef;
};
