/** @jsx React.DOM */
var React = require('react/addons');

var Caroussel = React.createClass({

    getDefaultProps: function() {
        return {
            width: 470,
            animationDelay: 5000,
            transitionDelay: 1,
            showIndicators: true,
            showBtnControls: true,
            carouselTitle: null
        }
    },

    getInitialState: function() {
        return {
            timer: null,
            caroussel: null,
            loopCpt: 0,
            isActiveAnimation: false
        }
    },

    componentDidMount: function() {
        this.setState({
            caroussel: this.refs.caroussel.getDOMNode()
        });

        this.startInterval();
    },

    startInterval: function() {
        this.setState({
            timer: setInterval(this.animateL2R, this.props.animationDelay, 0)
        });
    },

    stopInterval: function() {
        clearInterval(this.state.timer);
    },

    setTransition: function() {
        this.state.caroussel.style.webkitTransition = "all " + this.props.transitionDelay + "s";
        this.state.caroussel.style.MozTransition = "all " + this.props.transitionDelay + "s";
        this.state.caroussel.style.MsTransition = "all " + this.props.transitionDelay + "s";
        this.state.caroussel.style.transition = "all " + this.props.transitionDelay + "s";
    },

    removeTransition: function() {
        this.state.caroussel.style.webkitTransition = "none";
        this.state.caroussel.style.MozTransition = "none";
        this.state.caroussel.style.MsTransition = "none";
        this.state.caroussel.style.transition = "none";
    },

    infiniteCarousselL2R: function(diff) {
        this.setState({
            isActiveAnimation: false
        });

        var first = this.state.caroussel.querySelector("li:first-child");
        this.removeTransition();

        if (Math.abs(diff) > 1) {
            for (var i = 0 ; i < Math.abs(diff) ; i++) {
                this.state.caroussel.appendChild(first);
                first = this.state.caroussel.querySelector("li:first-child");
            }
        } else { this.state.caroussel.appendChild(first); }

        this.state.caroussel.style.marginLeft = (this.props.width * this.state.loopCpt) + "px";

        setTimeout(this.setTransition, 200);
    },

    infiniteCarousselR2L: function(newLoopCpt) {
        this.setTransition();

        this.state.caroussel.style.webkitTransform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)";
        this.state.caroussel.style.MozTransform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)";
        this.state.caroussel.style.MsTransform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)";
        this.state.caroussel.style.transform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)";

        setTimeout(this.animationEnd, this.props.transitionDelay*1000);

        this.setState({
            loopCpt: newLoopCpt
        });
    },

    animationEnd: function() {
        this.setState({
            isActiveAnimation: false
        });
    },

    animateL2R: function(diff) {

        this.setState({
            isActiveAnimation: true
        });

        var diff = diff || 0;

        if (diff === 0) { newLoopCpt = this.state.loopCpt+1;
        } else { newLoopCpt = this.state.loopCpt+diff; }

        this.setState({
            loopCpt: newLoopCpt
        });

        this.setTransition();
        this.state.caroussel.style.webkitTransform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)";
        this.state.caroussel.style.MozTransform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)";
        this.state.caroussel.style.MsTransform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)";
        this.state.caroussel.style.transform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)";
        setTimeout(this.infiniteCarousselL2R, this.props.transitionDelay*1000, diff);
    },

    animateR2L: function(diff) {
        this.setState({
            isActiveAnimation: true
        });

        var diff = diff || 0;

        if (diff === 0) { newLoopCpt = this.state.loopCpt-1;
        } else {  newLoopCpt = this.state.loopCpt+diff; }

        this.removeTransition();

        var last = this.state.caroussel.querySelector("li:last-child");

        if (Math.abs(diff) > 1) {
            for (var i = 0 ; i < Math.abs(diff) ; i++) {
                this.state.caroussel.insertBefore(last, this.state.caroussel.firstChild);
                last = this.state.caroussel.querySelector("li:last-child");
            }
        } else { this.state.caroussel.insertBefore(last, this.state.caroussel.firstChild); }

        this.state.caroussel.style.marginLeft = (this.props.width * (newLoopCpt)) + "px";

        setTimeout(this.infiniteCarousselR2L, 0, newLoopCpt);
    },

    handleClick: function(idx) {
        if (!this.state.isActiveAnimation) {
            this.stopInterval();

            var diff = parseInt(idx-this.getActiveIndicator(), 10);

            if (diff < 0) { this.animateR2L(diff);
            } else { this.animateL2R(diff); }

            this.startInterval();
        }
    },

    getActiveIndicator: function() {
        return this.state.loopCpt % this.props.data.length
    },

    getTitle: function() {
        if (this.props.carouselTitle != null) {
            return <h3 className="left cUniv txtB mbs">
                        {this.props.carouselTitle}
            </h3>
        }
    },

    getIndicators: function() {
        if (this.props.showIndicators) {
            var liItems = this.props.data.map(function(content, idx) {
                return <ItemIndicator key={"itemIndicator-" + idx}
                idx={idx}
                loopCpt={this.state.loopCpt}
                nbItemTotal={this.props.data.length}
                handleClick={this.handleClick} />
            }.bind(this));
            return <ul style={{width: this.props.width}} className="carousselItemIndicators">
                        {liItems}
            </ul>
        }
    },

    getControlBtn: function() {
        if (this.props.showBtnControls) {
            return <div style={{width: this.props.width, "text-align": "center"}} className="btnControls">
                <input type="button" value="||" onClick={this.stopInterval} className="btn univ" />
                <input type="button" value=">" onClick={this.startInterval} className="btn univ" />
            </div>
        }
    },

    render: function() {
        var liItems = this.props.data.map(function(content, idx) {
            return <Diapositive key={"item-" + idx } width={this.props.width} content={content} idx={idx} />
        }.bind(this));

        return (
            <div>

                {this.getTitle()}

                {this.getIndicators()}

                <div style={{width: this.props.width}} className="caroussel-container"
                onMouseEnter={this.stopInterval}
                onMouseLeave={this.startInterval}>
                    <ul ref="caroussel" className="caroussel">
                        {liItems}
                    </ul>
                </div>

                {this.getControlBtn()}

            </div>
            )
    }
});

var ItemIndicator = React.createClass({

    getInitialState: function() {
        return {
            isActive: false
        }
    },

    getActiveIndicator: function() {
        return this.props.loopCpt % this.props.nbItemTotal
    },

    onHandleClick: function() {
        this.props.handleClick(this.props.idx);
    },

    render: function() {
        var classe = React.addons.classSet({
            active: this.props.idx == this.getActiveIndicator()
        });
        return (
            <li className={classe} onClick={this.onHandleClick}></li>
            )
    }
});

var Diapositive = React.createClass({

    render: function() {

        var classes = React.addons.classSet({
            "cUniv": !this.props.content.sacemPlus,
            "cPlus": this.props.content.sacemPlus,
            "mbs": true,
            "txtUpp": true
        });

        return (
            <li style={{width: this.props.width}}>
                <div className="mod">
                    <img src={rootUrl+this.props.content.img} alt={this.props.content.title}
                    className="left" />

                    <div className="legend left">
                        <h4 className={classes} dangerouslySetInnerHTML={{__html: this.props.content.title}}></h4>
                        <div className="descr" dangerouslySetInnerHTML={{__html: this.props.content.descr}} />
                    </div>
                </div>
            </li>
            );
    }

});

module.exports = Caroussel;