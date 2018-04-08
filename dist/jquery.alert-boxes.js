$.fn.alertBox = function (data) {

    this.ucfirst = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if(typeof data === "string") {
        data = {message: data};
    }
    data = $.extend(true, {}, $.fn.alertBox.options, data);

    // status aliases
    switch (data.type) {
        case "error":
            data.type = "danger";
            break;
        case "skipped":
            data.type = "info";
    }

    // get alert boxes container
    this.alertContainer = this.children('.alert-boxes').first();
    if(this.alertContainer.length < 1) {
        this.alertContainer = $.fn.alertBox.createContainer(this, data.container);
        console.log('new container');
    } else {
        console.log('existing container');
    }

    // message visibility based on word count
    // 210 W/m (3.5 W/s) + 2 seconds reaction time and buffer
    var wordCount = data.message.trim().split(/\s+/).length;
    var messageVisibilityTime = (wordCount / 3.5 + 2) * 1000;

    // create alert box
    var alertBox = $('<div class="alert alert-dismissible"></div>');
    alertBox.addClass('alert-' + data.type);
    alertBox.addClass('theme-' + data.theme);
    alertBox.attr('id', 'alert-' + $.fn.alertBox.boxCount);

    var msgHtml = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>';
    if(data.enableHeading) {
        var headingText = typeof data.heading === 'undefined' ? this.ucfirst(data.type) : data.heading;
        msgHtml += '<h' + data.headingSize + ' class="head">' + headingText + '</h' + data.headingSize + '>';
    }
    msgHtml += data.message;

    alertBox.html(msgHtml);

    // remove oldest alert box if more than 3 are showing
    if (this.alertContainer.find(".alert").length >= 3) {
        this.alertContainer.find(".alert").last().remove();
    }

    // animate alert
    this.alertContainer.prepend(alertBox);
    alertBox.slideDown()
        .delay(messageVisibilityTime)
        .slideUp(function () {
            $(this).remove();
        })
    ;

    $.fn.alertBox.boxCount++;
};
$.fn.alertBox.boxCount = 0;
$.fn.alertBox.options = {
    type: 'success',
    css: {},
    theme: 'white',
    enableHeading: true,
    headingSize: 4,
    container: {
        align: 'bottom-left',
        offsetX: 0,
        offsetY: 0,
        css: {
            position: 'absolute',
            maxWidth: 400,
            width: 'auto',
            zIndex: 2500
        }
    }
};

$.fn.alertBox.createContainer = function(target, options) {
    options = $.extend({}, $.fn.alertBox.options.container, options);

    switch(options.align) {
        case 'top-left':
            options.css.top = options.offsetY;
            options.css.left = options.offsetX;
            break;
        case 'top-right':
            options.css.top = options.offsetY;
            options.css.right = options.offsetX;
            break;
        case 'bottom-left':
            options.css.bottom = options.offsetY;
            options.css.left = options.offsetX;
            break;
        default:
        case 'bottom-right':
            options.css.bottom = options.offsetY;
            options.css.right = options.offsetX;
            break;
    }
    var container = $('<div class="alert-boxes"></div>');
    container.css(options.css);

    target.prepend(container);
    return container;
};