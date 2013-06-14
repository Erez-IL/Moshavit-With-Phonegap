(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  var Application, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('lib/view_helper');

  Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      this.initialize = __bind(this.initialize, this);    _ref = Application.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Application.prototype.initialize = function() {
      var _this = this;

      this.on("initialize:after", function(options) {
        Backbone.history.start();
        return typeof Object.freeze === "function" ? Object.freeze(_this) : void 0;
      });
      this.addInitializer(function(options) {
        var AppLayout;

        AppLayout = require('views/AppLayout');
        _this.layout = new AppLayout();
        return _this.layout.render();
      });
      this.addInitializer(function(options) {
        var Router;

        Router = require('lib/router');
        return _this.router = new Router();
      });
      return this.start();
    };

    return Application;

  })(Backbone.Marionette.Application);

  module.exports = new Application();
  
});
window.require.register("initialize", function(exports, require, module) {
  var application;

  application = require('application');

  _.extend(Backbone.Marionette.View.prototype, Backbone.Epoxy.View);

  _.extend(Backbone.Model.prototype, Backbone.Epoxy.Model);

  $(function() {
    return application.initialize();
  });
  
});
window.require.register("lib/router", function(exports, require, module) {
  var HomeView, Login, LoginView, Message, MessageView, Messages, MessagesView, NewMessage, NewMessageView, NewUser, NewUserView, Router, User, UserView, Users, UsersView, application, updateProfileView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  application = require('application');

  HomeView = require('views/HomeView');

  LoginView = require('views/LoginView');

  UserView = require('views/UserView');

  NewUserView = require('views/NewUserView');

  UsersView = require('views/UsersView');

  MessageView = require('views/MessageView');

  NewMessageView = require('views/NewMessageView');

  MessagesView = require('views/MessagesView');

  updateProfileView = require('views/updateProfileView');

  User = require('models/user');

  Users = require('models/users');

  Message = require('models/message');

  NewMessage = require('models/newMessage');

  Messages = require('models/messages');

  Login = require('models/login');

  NewUser = require('models/newUser');

  module.exports = Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      this.updateProfile = __bind(this.updateProfile, this);
      this.userView = __bind(this.userView, this);
      this.messageViewById = __bind(this.messageViewById, this);
      this.usersViewDefault = __bind(this.usersViewDefault, this);
      this.userViewDefault = __bind(this.userViewDefault, this);
      this.messagesViewDefault = __bind(this.messagesViewDefault, this);
      this.newMessageViewDefault = __bind(this.newMessageViewDefault, this);
      this.loginView = __bind(this.loginView, this);
      this.newUserView = __bind(this.newUserView, this);
      this.messageViewDefault = __bind(this.messageViewDefault, this);
      this.home = __bind(this.home, this);    _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Router.prototype.routes = {
      '': 'home',
      'messageBoard': 'messageViewDefault',
      'newmessageBoard': 'newMessageViewDefault',
      'messagesBoard': 'messagesViewDefault',
      'user': 'userViewDefault',
      'users': 'usersViewDefault',
      'user/:id': 'userView',
      'updateProfile/:id': 'updateProfile',
      'messageBoard/:id': 'messageViewById',
      'login': 'loginView',
      'newuser': 'newUserView'
    };

    Router.prototype.home = function() {
      var view;

      view = new HomeView();
      return application.layout.content.show(view);
    };

    Router.prototype.messageViewDefault = function() {
      var view;

      view = new MessageView();
      return application.layout.content.show(view);
    };

    Router.prototype.newUserView = function() {
      var view;

      view = new NewUserView();
      return application.layout.content.show(view);
    };

    Router.prototype.loginView = function() {
      var view;

      view = new LoginView({
        model: new Login()
      });
      return application.layout.content.show(view);
    };

    Router.prototype.newMessageViewDefault = function() {
      var view;

      view = new NewMessageView({
        model: new NewMessage()
      });
      return application.layout.content.show(view);
    };

    Router.prototype.messagesViewDefault = function() {
      var messages,
        _this = this;

      messages = new Messages;
      return messages.fetch({
        success: function() {
          var view;

          view = new MessagesView({
            collection: messages
          });
          return application.layout.content.show(view);
        }
      });
    };

    Router.prototype.userViewDefault = function() {
      var view;

      view = new UserView();
      return application.layout.content.show(view);
    };

    Router.prototype.usersViewDefault = function() {
      var users,
        _this = this;

      users = new Users;
      return users.fetch({
        success: function() {
          var view;

          view = new UsersView({
            collection: users
          });
          return application.layout.content.show(view);
        }
      });
    };

    Router.prototype.messageViewById = function(id) {
      var message,
        _this = this;

      message = new Message({
        id: id
      });
      return message.fetch({
        success: function() {
          var view;

          view = new MessageView({
            model: message
          });
          return application.layout.content.show(view);
        }
      });
    };

    Router.prototype.userView = function(id) {
      var user,
        _this = this;

      user = new User({
        id: id
      });
      return user.fetch({
        success: function() {
          var view;

          view = new UserView({
            model: user
          });
          return application.layout.content.show(view);
        }
      });
    };

    Router.prototype.updateProfile = function(id) {
      var user,
        _this = this;

      user = new User({
        id: id
      });
      return user.fetch({
        success: function() {
          var view;

          view = new updateProfileView({
            model: user
          });
          return application.layout.content.show(view);
        }
      });
    };

    return Router;

  })(Backbone.Router);
  
});
window.require.register("lib/view_helper", function(exports, require, module) {
  Handlebars.registerHelper('pick', function(val, options) {
    return options.hash[val];
  });

  Handlebars.registerHelper('date', function(val, options) {
    return "" + val.dayOfMonth + "/" + val.monthOfYear + "/" + val.year + "";
  });
  
});
window.require.register("models/collection", function(exports, require, module) {
  var Collection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      _ref = Collection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Collection;

  })(Backbone.Collection);
  
});
window.require.register("models/login", function(exports, require, module) {
  var Login, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = Login = (function(_super) {
    __extends(Login, _super);

    function Login() {
      _ref = Login.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Login.prototype.url = "http://localhost:8081/api/users/login";

    return Login;

  })(Model);
  
});
window.require.register("models/message", function(exports, require, module) {
  var Massage, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = Massage = (function(_super) {
    __extends(Massage, _super);

    function Massage() {
      _ref = Massage.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Massage.prototype.urlRoot = "http://localhost:8081/api/boardMessage";

    return Massage;

  })(Model);
  
});
window.require.register("models/messages", function(exports, require, module) {
  var Collection, Message, Messages, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('./collection');

  Message = require('./message');

  module.exports = Messages = (function(_super) {
    __extends(Messages, _super);

    function Messages() {
      _ref = Messages.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Messages.prototype.model = Message;

    Messages.prototype.url = 'http://localhost:8081/api/boardMessage';

    return Messages;

  })(Collection);
  
});
window.require.register("models/model", function(exports, require, module) {
  var Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      _ref = Model.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Model;

  })(Backbone.Model);
  
});
window.require.register("models/newMessage", function(exports, require, module) {
  var Model, NewMassage, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = NewMassage = (function(_super) {
    __extends(NewMassage, _super);

    function NewMassage() {
      _ref = NewMassage.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewMassage.prototype.urlRoot = "http://localhost:8081/api/boardMessage";

    return NewMassage;

  })(Model);
  
});
window.require.register("models/newUser", function(exports, require, module) {
  var Model, NewUser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = NewUser = (function(_super) {
    __extends(NewUser, _super);

    function NewUser() {
      _ref = NewUser.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewUser.prototype.urlRoot = "http://localhost:8081/api/users";

    return NewUser;

  })(Model);
  
});
window.require.register("models/user", function(exports, require, module) {
  var Model, User, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = User = (function(_super) {
    __extends(User, _super);

    function User() {
      _ref = User.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    User.prototype.urlRoot = "http://localhost:8081/api/users";

    return User;

  })(Model);
  
});
window.require.register("models/users", function(exports, require, module) {
  var Collection, User, Users, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('./collection');

  User = require('./user');

  module.exports = Users = (function(_super) {
    __extends(Users, _super);

    function Users() {
      _ref = Users.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Users.prototype.model = User;

    Users.prototype.url = 'http://localhost:8081/api/users';

    return Users;

  })(Collection);
  
});
window.require.register("views/AppLayout", function(exports, require, module) {
  var AppLayout, application, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  application = require('application');

  module.exports = AppLayout = (function(_super) {
    __extends(AppLayout, _super);

    function AppLayout() {
      _ref = AppLayout.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AppLayout.prototype.template = require('views/templates/appLayout');

    AppLayout.prototype.el = "body";

    AppLayout.prototype.regions = {
      content: "#content"
    };

    return AppLayout;

  })(Backbone.Marionette.Layout);
  
});
window.require.register("views/HomeView", function(exports, require, module) {
  var HomeView, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('./templates/home');

  module.exports = HomeView = (function(_super) {
    __extends(HomeView, _super);

    function HomeView() {
      _ref = HomeView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeView.prototype.id = 'home-view';

    HomeView.prototype.template = template;

    return HomeView;

  })(Backbone.Marionette.ItemView);
  
});
window.require.register("views/LoginView", function(exports, require, module) {
  var LoginView, User, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  User = require('models/user');

  module.exports = LoginView = (function(_super) {
    __extends(LoginView, _super);

    function LoginView() {
      this.login = __bind(this.login, this);
      this.logout = __bind(this.logout, this);    _ref = LoginView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LoginView.prototype.template = require('./templates/login');

    LoginView.prototype.events = {
      "click .loginButton": 'login',
      "click .logoutButton": 'logout'
    };

    LoginView.prototype.logout = function() {
      $.get("/api/users/logout");
      console.log("User Session Cleared");
      return document.getElementById('sessionUsername').innerHTML = "Guest";
    };

    LoginView.prototype.login = function() {
      var _this = this;

      return $.ajax({
        url: "/api/users/login",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {
          username: $("#username").val(),
          password: $("#password").val()
        },
        success: function(data) {
          console.log("Logged in as " + $("#username").val() + " successfully");
          document.getElementById('sessionUsername').innerHTML = $("#username").val();
          alert("wellcom " + $("#username").val());
          return document.location.href = "/#";
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("Failed logging in " + $("#username").val() + ": " + errorThrown);
          document.getElementById('sessionUsername').innerHTML = "Guest";
          alert("Invalid Password OR Username");
          return $("#password").val("");
        }
      });
    };

    return LoginView;

  })(Backbone.Marionette.ItemView);
  
});
window.require.register("views/MessageView", function(exports, require, module) {
  var MessageView, User, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  User = require('models/user');

  module.exports = MessageView = (function(_super) {
    __extends(MessageView, _super);

    function MessageView() {
      this.save = __bind(this.save, this);    _ref = MessageView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MessageView.prototype.template = require('./templates/messageBoard');

    MessageView.prototype.events = {
      "click .save": 'save'
    };

    MessageView.prototype.save = function() {
      var user, userId,
        _this = this;

      userId = this.$(".authorId").val();
      user = new User({
        id: userId
      });
      return user.fetch({
        success: function() {}
      }, this.model.set({
        author: user,
        subject: this.$(".subject").val(),
        messageText: this.$(".messageText").val()
      }), console.log(this.model), this.model.save());
    };

    return MessageView;

  })(Backbone.Marionette.ItemView);
  
});
window.require.register("views/MessagesView", function(exports, require, module) {
  var MessageView, MessagesView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MessageView = require('views/MessageView');

  module.exports = MessagesView = (function(_super) {
    __extends(MessagesView, _super);

    function MessagesView() {
      _ref = MessagesView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MessagesView.prototype.itemView = MessageView;

    MessagesView.prototype.className = 'messages';

    return MessagesView;

  })(Backbone.Marionette.CollectionView);
  
});
window.require.register("views/NewMessageView", function(exports, require, module) {
  var NewMessageView, User, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  User = require('models/user');

  module.exports = NewMessageView = (function(_super) {
    __extends(NewMessageView, _super);

    function NewMessageView() {
      this.saveNewMessage = __bind(this.saveNewMessage, this);    _ref = NewMessageView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewMessageView.prototype.template = require('./templates/newMessageBoard');

    NewMessageView.prototype.events = {
      "click .save": 'saveNewMessage'
    };

    NewMessageView.prototype.saveNewMessage = function() {
      var user, userId,
        _this = this;

      userId = this.$(".authorId").val();
      user = new User({
        id: userId
      });
      return user.fetch({
        success: function() {}
      }, this.model.set({
        author: user,
        subject: this.$(".subject").val(),
        messageText: this.$(".messageText").val()
      }), console.log(this.model), this.model.save());
    };

    return NewMessageView;

  })(Backbone.Marionette.ItemView);
  
});
window.require.register("views/NewUserView", function(exports, require, module) {
  var NewUserView, User, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  User = require('models/user');

  module.exports = NewUserView = (function(_super) {
    __extends(NewUserView, _super);

    function NewUserView() {
      this.register = __bind(this.register, this);    _ref = NewUserView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewUserView.prototype.template = require('./templates/newUser');

    NewUserView.prototype.events = {
      "click .register": 'register'
    };

    NewUserView.prototype.register = function() {
      var user;

      user = new User;
      user.set("firstName", this.$("input.firstName").val());
      user.set("lastName", this.$("input.lastName").val());
      user.set("email", this.$("input.email").val());
      user.set("password", this.$("input.password").val());
      user.set("username", this.$("input.username").val());
      console.log(user);
      return user.save();
    };

    return NewUserView;

  })(Backbone.Marionette.ItemView);
  
});
window.require.register("views/UserView", function(exports, require, module) {
  var UserView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = UserView = (function(_super) {
    __extends(UserView, _super);

    function UserView() {
      this.save = __bind(this.save, this);
      this.updateFirstName = __bind(this.updateFirstName, this);
      this.update = __bind(this.update, this);
      this.onRender = __bind(this.onRender, this);    _ref = UserView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    UserView.prototype.template = require('./templates/user');

    UserView.prototype.events = {
      "click .save": 'save',
      "keyup input.firstName": "updateFirstName"
    };

    UserView.prototype.modelEvents = {
      "change": 'update'
    };

    UserView.prototype.onRender = function() {};

    UserView.prototype.update = function() {
      this.updateFirstName();
      this.$("span.firstName").text(this.model.get("firstName"));
      return this.$("span.lastName").text(this.model.get("lastName"));
    };

    UserView.prototype.updateFirstName = function() {
      return this.model.set('firstName', this.$("input.firstName").val());
    };

    UserView.prototype.save = function() {
      return this.model.save();
    };

    return UserView;

  })(Backbone.Marionette.ItemView);
  
});
window.require.register("views/UsersView", function(exports, require, module) {
  var UserView, UsersView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  UserView = require('views/UserView');

  module.exports = UsersView = (function(_super) {
    __extends(UsersView, _super);

    function UsersView() {
      _ref = UsersView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    UsersView.prototype.itemView = UserView;

    UsersView.prototype.className = 'users';

    return UsersView;

  })(Backbone.Marionette.CollectionView);
  
});
window.require.register("views/templates/appLayout", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"navbar navbar-fixed-top\">\n    <div class=\"navbar-inner\">\n        <div id=\"appNavBar\"class=\"container\">\n            <a style=\"float: left\" href=\"#\" onclick=\"javascript:navigator.app.clearHistory();\"><img src=\"img/logo.png\"\n                                                 style=\"max-height: 48px; max-width: 48px;\"></a>\n\n            <!-- todo Backbone.history.start() if pressed-->\n            <!--<a class=\"btn \" href=\"#user\">UserView</a>-->\n            <!--<a class=\"btn \" href=\"#users\">UsersView</a>-->\n            <!--<a class=\"btn \" href=\"#messageBoard\">messageView</a>-->\n            <!--<a class=\"btn \" href=\"#messagesBoard\">messagesView</a>-->\n            <a style=\"cursor:pointer; float: right\" onclick=\"javascript:navigator.app.exitApp(); \"><img\n                    src=\"http://cdn1.iconfinder.com/data/icons/gis/quit.png\" style=\"height: 48px; width: 48px;\"></a>\n  					<p style=\"text-align: center\">שלום : <b id='sessionUsername'></b> </p>\n        </div>\n    </div>\n</div>\n\n<div class=\"row-fluid\">\n        <div id=\"content\" class=\"container\"></div>\n</div>\n\n";
    });
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"row\">\n    <div class=\"span12\">\n\n\n        <a href=\"#user\"> <img src=\"img/ico/Android-Users-48.png\" style=\"max-height: 100px; max-width: 100px;\" width=\"90\"></a>\n        <a href=\"#users\"> <img src=\"img/ico/Android-Users-48.png\" style=\"max-height: 100px; max-width: 100px;\" width=\"90\"></a>\n        <a href=\"#messageBoard\"><img src=\"http://c.dryicons.com/images/icon_sets/grey_moonlight_icons/png/128x128/news.png\"\n                ></a>\n        <a href=\"#messagesBoard\"><img src=\"img/ico/Android-Messages-48.png\" style=\"max-height: 100px; max-width: 100px;\"\n                ></a>\n        <!--<a href=\"#settings\"><img src=\"http://c.dryicons.com/images/icon_sets/grey_moonlight_icons/png/128x128/settings.png\"-->\n        <!--width=\"90\"></a>-->\n        <!--<a href=\"#survey\"><img src=\"img/ico/Android-Survey-48.png\" ></a>-->\n        <!--<a href=\"#calender\"><img src=\"img/ico/Android-Calendar-48.png\" ></a>-->\n\n				<a href=\"#login\" class=\"btn login\">login</a>\n				<a href=\"#newuser\" class=\"btn newuser\">New User</a>\n        <a href=\"#newmessageBoard\" class=\"btn newMessage\">NewMSG</a>\n\n    </div>\n</div>\n\n";
    });
});
window.require.register("views/templates/login", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"well span12\" xmlns=\"http://www.w3.org/1999/html\">\n    <div class=\"input-prepend\">\n        <label for=\"username\">שם משתמש</label>\n        <input id=\"username\" type=\"text\" class=\"username\" value=\"\">\n    </div>\n    <div class=\"input-prepend\">\n        <label for=\"password\">סיסמה</label>\n        <input id=\"password\" type=\"password\" class=\"password\" value=\"\">\n    </div>\n    <div style=\"text-align: center\">\n        <button class=\"btn logoutButton\" onclick=\"$.get( '/api/users/logout')\">Logout</button>\n        <button class=\"btn loginButton\">Login</button>\n        <br><b id=\"invalidPassword\"></b><br>\n\n        <a class=\" forgetPasswordButton\">Forgot my password</a><!--todo forgot my password-->\n    </div>\n</div>";
    });
});
window.require.register("views/templates/messageBoard", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "", stack1, stack2, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

  function program1(depth0,data) {
    
    var stack1, options;
    options = {hash:{},data:data};
    return escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, depth0.dateOfIssue, options) : helperMissing.call(depth0, "date", depth0.dateOfIssue, options)));
    }

    buffer += "<div class=\"well span12\" onclick=\"window.location='#messageBoard/";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "'\" xmlns=\"http://www.w3.org/1999/html\"\n     xmlns=\"http://www.w3.org/1999/html\" xmlns=\"http://www.w3.org/1999/html\" xmlns=\"http://www.w3.org/1999/html\">\n    <div class=\"input-prepend\">\n        <label for=\"messageId\">מספר הודעה</label>\n        <input type=\"text\" class=\"messageId\" value=\"";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" disabled>\n    </div>\n    <div class=\"input-prepend\">\n        <label for=\"dateOfIssue\">תאריך יצירה</label>\n        <input type=\"text\" class=\"dateOfIssue \"\n               value=\"";
    stack1 = helpers['if'].call(depth0, depth0.dateOfIssue, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\" disabled>\n    </div>\n    <!--subject-->\n    <div class=\"input-prepend\">\n        <label for=\"Subject\">נושא</label>\n        <input type=\"text\" class=\"subject \" value=\"";
    if (stack1 = helpers.subject) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.subject; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" readonly=\"true\"\n               ondblclick=\"this.readOnly=false\">\n    </div>\n    <!-- author.username -->\n    <div class=\"input-prepend\">\n        <label for=\"author.username \">מחבר ההודעה</label>\n        <input type=\"text\" class=\"author.username \" value=\""
      + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "\" placeholder=\"author.username\"\n               required=\"required\" disabled>\n    </div>\n    <!--message-->\n    <div class=\"input-prepend\">\n        <label for=\"messageText\">הודעה</label>\n        <textarea type =\"text\" name=\"message\" class=\"messageText\" placeholder=\"Enter Your Message Here ...\"\n                  disabled>";
    if (stack2 = helpers.messageText) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
    else { stack2 = depth0.messageText; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
    buffer += escapeExpression(stack2)
      + "</textarea>\n    </div>\n    <button class=\"btn save\">שמור</button>\n</div>";
    return buffer;
    });
});
window.require.register("views/templates/messagesBoard", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "-->\n<!--<div class=\"well span6\" id=\"messageForm\">-->\n<!--<div id=\"legend\">-->\n<!--<legend class=\"\">Board Messages</legend>-->\n<!--</div>-->\n<!--<table id=\"messageTable\" class=\"message table table-hover tablesorter\">-->\n<!--<thead>-->\n<!--<th class=\"header\">ID</th>-->\n<!--<th class=\"header\">Subject</th>-->\n<!--<th class=\"header\">Author</th>-->\n<!--<th class=\"header\">Date Of Issue</th>-->\n<!--</thead>-->\n<!--<tbody>-->\n        <!--";
    stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "-->\n<!--</tbody>-->\n<!--</table>-->\n<!--</div>-->\n        <!--";
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "-->\n<!--<tr>-->\n<!--<td class=\"ID\">";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>-->\n<!--<td>";
    if (stack1 = helpers.subject) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.subject; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>-->\n<!--<td>"
      + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "</td>-->\n<!--<td>"
      + escapeExpression(((stack1 = ((stack1 = depth0.dateOfIssue),stack1 == null || stack1 === false ? stack1 : stack1.dayOfMonth)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "/"
      + escapeExpression(((stack1 = ((stack1 = depth0.dateOfIssue),stack1 == null || stack1 === false ? stack1 : stack1.monthOfYear)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "/"
      + escapeExpression(((stack1 = ((stack1 = depth0.dateOfIssue),stack1 == null || stack1 === false ? stack1 : stack1.year)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "</td>-->\n<!--</tr>-->\n        <!--";
    return buffer;
    }

  function program4(depth0,data) {
    
    
    return "-->\n<!--<div id=\"messageForm\" class=\"well span6\">-->\n<!--<div id=\"legend\">-->\n<!--<legend class=\"\">Board Messages</legend>-->\n<!--</div>-->\n<!--<table class=\"users table table-hover \">-->\n<!--<tr>-->\n<!--</tr>-->\n<!--</table>-->\n<!--</div>-->\n        <!--";
    }

  function program6(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div class=\"well span6\">\n	";
    stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n";
    return buffer;
    }
  function program7(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div class=\"well span5\">\n			    <img src=\"http://a.dryicons.com/images/icon_sets/grey_moonlight_icons/png/128x128/comments.png\"\n			         class=\"pull-left\" width=\"60\">\n			    <h4>\n						";
    if (stack1 = helpers.subject) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.subject; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\n			    </h4>\n				<h6>";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</h6>\n				";
    stack1 = helpers['if'].call(depth0, depth0.dateOfIssue, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n			    <p>\n						";
    if (stack1 = helpers.messageText) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.messageText; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\n			    </p>\n			</div>\n	";
    return buffer;
    }
  function program8(depth0,data) {
    
    var stack1, options;
    options = {hash:{},data:data};
    return escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, depth0.dateOfIssue, options) : helperMissing.call(depth0, "date", depth0.dateOfIssue, options)));
    }

  function program10(depth0,data) {
    
    
    return "\n	NoData at server\n";
    }

    buffer += "<!--";
    stack1 = helpers['if'].call(depth0, depth0, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "-->\n\n\n\n\n";
    stack1 = helpers['if'].call(depth0, depth0, {hash:{},inverse:self.program(10, program10, data),fn:self.program(6, program6, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    return buffer;
    });
});
window.require.register("views/templates/newMessageBoard", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<!--<h2>Message View</h2>-->\n<div class=\"well span12\">\n    <!--subject-->\n    <div class=\"input-prepend\">\n        <label for=\"subject\">subject</label>\n        <input type=\"text\" class=\"subject\" value=\"\">\n    </div>\n    <!-- author.username -->\n    <div class=\"input-prepend\">\n        <label for=\"authorId\">author.id</label>\n        <input type=\"text\" class=\"authorId\" value=\"\" placeholder=\"author.id\"\n               required=\"required\">\n    </div>\n    <!--message-->\n    <div class=\"input-prepend\">\n        <label for=\"messageText\">Message</label>\n        <textarea type=\"text\" name=\"message\" class=\"messageText\" placeholder=\"Enter Your Message Here ...\"\n                ></textarea>\n    </div>\n    <button class=\"btn save\">Save</button>\n</div>";
    });
});
window.require.register("views/templates/newUser", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<!--<h2>New User</h2>-->\n<div class=\"well span12\" xmlns=\"http://www.w3.org/1999/html\" xmlns=\"http://www.w3.org/1999/html\"\n     xmlns=\"http://www.w3.org/1999/html\">\n    <!--UserName-->\n    <div class=\"input-prepend\">\n        <label for=\"username\" >UserName</label>\n        <input type=\"text\" style=\"margin-top:-5px;\" class=\"username\" value=\"\" >\n    </div>\n    <!-- E-mail -->\n    <div class=\"input-prepend\">\n        <label for=\"email\">E-Mail</label>\n        <input type=\"email\" class=\"email\" value=\"\" placeholder=\"Email\" required=\"required\" >\n    </div>\n    <!-- First Name -->\n    <div class=\"input-prepend\">\n        <label for=\"firstName\">FirstName</label>\n        <input type=\"text\" class=\"firstName\" value=\"\" placeholder=\"First name\" >\n    </div>\n    <!-- Last Name -->\n    <div class=\"input-prepend\">\n        <label for=\"lastName\">LastName</label>\n        <input type=\"text\" class=\"lastName\" value=\"\" placeholder=\"Last name\" >\n    </div>\n    <!-- Membership Type-->\n    <div class=\"input-prepend\">\n        <label for=\"membership\">Membership</label>\n        <input type=\"text\" class=\"membership\" value=\"\" placeholder=\"Membership\" >\n    </div>\n		<div class=\"input-prepend\">\n      <label for=\"password\">password</label>\n      <input id=\"password\" type=\"password\" class=\"password\" value=\"\">\n  </div>\n		<div class=\"input-prepend\">\n      <label for=\"passwordConfirm\">password Confirm</label>\n      <input id=\"passwordConfirm\" type=\"password\" class=\"passwordConfirm\" value=\"\">\n  </div>\n		<button class=\"btn clear\">Clear</button>\n  <button class=\"btn register\">Register</button>\n</div>\n";
    });
});
window.require.register("views/templates/updateProfile", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

  function program1(depth0,data) {
    
    var stack1, options;
    options = {hash:{},data:data};
    return escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, depth0.dateOfIssue, options) : helperMissing.call(depth0, "date", depth0.dateOfIssue, options)));
    }

    buffer += "<h2 xmlns=\"http://www.w3.org/1999/html\" xmlns=\"http://www.w3.org/1999/html\" xmlns=\"http://www.w3.org/1999/html\"\n    xmlns=\"http://www.w3.org/1999/html\" xmlns=\"http://www.w3.org/1999/html\">Edit User Profile</h2>\n\n<div class=\"input-prepend\">\n    <label for=\"userID\">ID</label>\n    <input type=\"text\" class=\"userID\" value=\"";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" disabled>\n	</div>\n<div class=\"input-prepend\">\n    <label for=\"dateOfIssue\">Since</label>\n    <input type=\"text\" class=\"dateOfIssue\"  value=\"";
    stack1 = helpers['if'].call(depth0, depth0.dateOfIssue, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\" disabled>\n</div>\n<!--UserName-->\n<div class=\"input-prepend\">\n    <label for=\"username\">UserName</label>\n    <input type=\"text\" class=\"username\" value=\"";
    if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" disabled>\n</div>\n<!-- E-mail -->\n<div class=\"input-prepend\">\n    <label for=\"email\">E-Mail</label>\n    <input type=\"email\" class=\"email\" value=\"";
    if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" placeholder=\"Email\" required=\"required\">\n</div>\n<!-- First Name -->\n<div class=\"input-prepend\">\n    <label for=\"firstName\">FirstName</label>\n    <input type=\"text\" class=\"firstName\" value=\"";
    if (stack1 = helpers.firstName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.firstName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" placeholder=\"First name\">\n</div>\n<!-- Last Name -->\n<div class=\"input-prepend\">\n    <label for=\"lastName\">LastName</label>\n    <input type=\"text\" class=\"lastName\" value=\"";
    if (stack1 = helpers.lastName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.lastName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" placeholder=\"Last name\">\n</div>\n<!-- Membership Type-->\n<div class=\"input-prepend\">\n    <label for=\"membership\">Membership</label>\n    <select class=\"membership span2\">\n        <option> ";
    if (stack1 = helpers.membership) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.membership; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</option>\n        <option>resident</option>\n        <option>member</option>\n    </select>\n</div>\n\n<!-- Password-->\n<div class=\"input-prepend\">\n    <label for=\"password\">Password</label>\n    <input type=\"password\" class=\"password\" name=\"password\">\n</div>\n<!-- Password confirm -->\n<div class=\"input-prepend\">\n    <label for=\"passwordConfirm\">Password (Confirm)</label>\n    <input type=\"password\" class=\"passwordConfirm\" name=\"passwordConfirm\" >\n</div>\n\n\n<a class=\"btn save\" href=\"#users\">Update</a>\n<!--<button class=\"btn save\">Update</button>-->\n";
    return buffer;
    });
});
window.require.register("views/templates/user", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

  function program1(depth0,data) {
    
    var stack1, options;
    options = {hash:{},data:data};
    return escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, depth0.dateOfIssue, options) : helperMissing.call(depth0, "date", depth0.dateOfIssue, options)));
    }

    buffer += "<!--<h2>User Profile</h2>-->\n<div class=\"well span12\" onclick=\"window.location='#updateProfile/";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "'\">\n    <div class=\"input-prepend\">\n        <label for=\"userID\">ID</label>\n        <input type=\"text\" class=\"userID\" value=\"";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" disabled>\n    </div>\n    <div class=\"input-prepend\">\n        <label for=\"dateOfIssue\">Since</label>\n        <input type=\"text\" class=\"dateOfIssue\"\n               value=\"";
    stack1 = helpers['if'].call(depth0, depth0.dateOfIssue, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\" disabled>\n    </div>\n    <!--UserName-->\n    <div class=\"input-prepend\">\n        <label for=\"username\">UserName</label>\n        <input type=\"text\" class=\"username\" value=\"";
    if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" disabled>\n    </div>\n    <!-- E-mail -->\n    <div class=\"input-prepend\">\n        <label for=\"email\">E-Mail</label>\n        <input type=\"email\" class=\"email\" value=\"";
    if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" placeholder=\"Email\" required=\"required\" disabled>\n    </div>\n    <!-- First Name -->\n    <div class=\"input-prepend\">\n        <label for=\"firstName\">FirstName</label>\n        <input type=\"text\" class=\"firstName\" value=\"";
    if (stack1 = helpers.firstName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.firstName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" placeholder=\"First name\" disabled>\n    </div>\n    <!-- Last Name -->\n    <div class=\"input-prepend\">\n        <label for=\"lastName\">LastName</label>\n        <input type=\"text\" class=\"lastName\" value=\"";
    if (stack1 = helpers.lastName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.lastName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" placeholder=\"Last name\" disabled>\n    </div>\n    <!-- Membership Type-->\n    <div class=\"input-prepend\">\n        <label for=\"membership\">Membership</label>\n        <input type=\"text\" class=\"membership\" value=\"";
    if (stack1 = helpers.membership) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.membership; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" placeholder=\"Membership\" disabled>\n    </div>\n</div>\n";
    return buffer;
    });
});
window.require.register("views/templates/users", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n    <table id=\"UserTableList\" class=\"users table table-hover\">\n        <thead>\n        <th class=\"header\">ID</th>\n        <th class=\"header\">Username</th>\n        <th class=\"header\">First Name</th>\n        <th class=\"header\">Last Name</th>\n				<th class=\"header\">E-Mail</th>\n        <th class=\"header\">Membership</th>\n				<th class=\"header\">Date Of Issue</th>\n				<th class=\"header\">Date Of Last Update</th>\n        </thead>\n        <tbody>\n					";
    stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n        </tbody>\n    </table>\n";
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n\n          <tr>\n              <td class=\"ID\">";
    if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n              <td>";
    if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n              <td>";
    if (stack1 = helpers.firstName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.firstName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n              <td>";
    if (stack1 = helpers.lastName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.lastName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n              <td>";
    if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n              <td>";
    if (stack1 = helpers.membership) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.membership; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n              <td>";
    stack1 = helpers['if'].call(depth0, depth0.dateOfIssue, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</td>\n              <td>";
    stack1 = helpers['if'].call(depth0, depth0.dateOfLastUpdate, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</td>\n          </tr>\n					";
    return buffer;
    }
  function program3(depth0,data) {
    
    var stack1, options;
    options = {hash:{},data:data};
    return escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, depth0.dateOfIssue, options) : helperMissing.call(depth0, "date", depth0.dateOfIssue, options)));
    }

  function program5(depth0,data) {
    
    var stack1, options;
    options = {hash:{},data:data};
    return escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, depth0.dateOfLastUpdate, options) : helperMissing.call(depth0, "date", depth0.dateOfLastUpdate, options)));
    }

  function program7(depth0,data) {
    
    
    return "\n		<table id=\"UserTableList\" class=\"users table table-hover \">\n        <thead>\n        	<th>No users found.</th>\n				</thead>\n				<tbody></tbody>\n		</table>\n";
    }

    buffer += "\n";
    stack1 = helpers['if'].call(depth0, depth0, {hash:{},inverse:self.program(7, program7, data),fn:self.program(1, program1, data),data:data});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    return buffer;
    });
});
window.require.register("views/updateProfileView", function(exports, require, module) {
  var updateProfile, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = updateProfile = (function(_super) {
    __extends(updateProfile, _super);

    function updateProfile() {
      this.save = __bind(this.save, this);
      this.onRender = __bind(this.onRender, this);    _ref = updateProfile.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    updateProfile.prototype.template = require('./templates/updateProfile');

    updateProfile.prototype.events = {
      "click .save": 'save'
    };

    updateProfile.prototype.onRender = function() {};

    updateProfile.prototype.save = function() {
      this.model.set("firstName", this.$("input.firstName").val());
      this.model.set("lastName", this.$("input.lastName").val());
      this.model.set("email", this.$("input.email").val());
      this.model.set("membership", this.$("input.membership").val());
      return this.model.save();
    };

    return updateProfile;

  })(Backbone.Marionette.ItemView);
  
});
