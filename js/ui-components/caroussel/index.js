/** @jsx React.DOM */
var React = require('react/addons');

var loopCpt = 0;

var Caroussel = React.createClass({

    getDefaultProps: function() {
        return {
            width: 470,
            animationDelay: 5000,
            transitionDelay: 1,
            showIndicators: true
        }
    },

    getInitialState: function() {
        return {
            timer: null,
            caroussel: null
        }
    },

    componentDidMount: function() {

        this.setState({
            caroussel: this.refs.caroussel.getDOMNode()
        });

        this.startInterval();
    },

    startInterval: function() {
        console.log('animation start');

        this.setState({
            timer: setInterval(this.animate, this.props.animationDelay)
        });
    },

    stopInterval: function() {
        console.log('animation pause...');
        clearInterval(this.state.timer);
    },

    setTransition: function() {
        console.log('setTransition');
        this.state.caroussel.style.webkitTransition = "all " + this.props.transitionDelay + "s"; // 6
    },

    deleteTransition: function() {
        console.log('deleteTransition');
        this.state.caroussel.style.webkitTransition = "none";
    },

    infiniteCaroussel: function() {
        console.log('loop');

        var first = this.state.caroussel.querySelector("li:first-child"); // 2

        this.deleteTransition();

        this.state.caroussel.appendChild(first); // 4
        this.state.caroussel.style.marginLeft = (this.props.width * loopCpt) + "px"; // 5

        setTimeout(this.setTransition, 500);
    },

    animate: function() {
        console.log('animate');
        loopCpt = loopCpt + 1;
        console.log('loopCpt', loopCpt);
        this.state.caroussel.style.webkitTransform = "translate3d(-" + (this.props.width * loopCpt) + "px,0px,0px)"; // 1

        setTimeout(this.infiniteCaroussel,1500);
    },

    getIndicators: function() {
        if (this.props.showIndicators) {
            var liItems = this.props.data.map(function(content, idx) {
                return <li key={"itemIndicator-" + idx}></li>
            });
            return liItems
        }
    },

    render: function() {

        var liItems = this.props.data.map(function(content, idx) {
            return <li style={{width: this.props.width}} key={"item-"+idx}>
                        <div className="mod">
                            <img src={content.img} alt=""
                            className="left" />

                            <div className="legend left">
                                <h4 className="cUniv mbs txtUpp">{content.title}</h4>
                                <div className="descr">{content.descr}</div>
                            </div>
                        </div>
                    </li>
        }.bind(this));

        return (
            <div>
                <ul style={{width: this.props.width}} className="carousselItemIndicators">
                    {this.getIndicators()}
                </ul>
                <div style={{width: this.props.width}} className="caroussel-container"
                    onMouseEnter={this.stopInterval}
                    onMouseLeave={this.startInterval}>
                    <ul ref="caroussel" className="caroussel">
                        {liItems}
                    </ul>
                </div>
            </div>
        )
    }

});

module.exports = Caroussel;
