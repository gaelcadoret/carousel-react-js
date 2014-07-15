carousel-react-js
=================

Infinite loop carousel

How to use it ?

<code>
var React = require('react/addons'),
    Caroussel = require('./ui-components/caroussel'),
    domready = require('domready');

var content = [
    {
        img: "img/illus-login_1.jpg",
        title: "Gros titre n°1",
        descr: "1 - Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor..."
    },
    {
        img: "img/illus-login_2.jpg",
        title: "Gros titre n°2",
        descr: "2 - Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor..."
    },
    {
        img: "img/illus-login_3.jpg",
        title: "Gros titre n°3",
        descr: "3 - Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor..."
    }
];

domready(function() {
    React.renderComponent(
        <Caroussel width="632" data={content} />,
        document.getElementsByClassName("caroussel__rp")[0]
    );
});
<code>
