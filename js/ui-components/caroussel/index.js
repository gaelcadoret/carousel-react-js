/** @jsx React.DOM */
var React = require('react/addons');

var BtnControl = React.createClass({

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

var Caroussel = React.createClass({

    getDefaultProps: function() {
        return {
            width: 470,
            animationDelay: 3000,
            transitionDelay: 1,
            showIndicators: true,
            showBtnControls: true
        }
    },

    getInitialState: function() {
        return {
            timer: null,
            caroussel: null,
            loopCpt: 0
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
            timer: setInterval(this.animateL2R, this.props.animationDelay, 0)
        });
    },

    stopInterval: function() {
        console.log('animation pause...');
        clearInterval(this.state.timer);
    },

    setTransition: function() {
        this.state.caroussel.style.webkitTransition = "all " + this.props.transitionDelay + "s"; // 6
    },

    deleteTransition: function() {
        this.state.caroussel.style.webkitTransition = "none";
    },

    infiniteCarousselL2R: function() {
        var first = this.state.caroussel.querySelector("li:first-child"); // 2

        this.deleteTransition();

        this.state.caroussel.appendChild(first); // 4
        this.state.caroussel.style.marginLeft = (this.props.width * this.state.loopCpt) + "px"; // 5

        setTimeout(this.setTransition, 500);
    },

    go: function(newLoopCpt) {
        this.state.caroussel.style.webkitTransform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)"; // 1
    },

    infiniteCarousselR2L: function(newLoopCpt) {
        var last = this.state.caroussel.querySelector("li:last-child"); // 2

        this.deleteTransition();

//        setTimeout(this.go1, 0);

        this.state.caroussel.insertBefore(last, this.state.caroussel.firstChild);
        this.state.caroussel.style.marginLeft = (this.props.width * (newLoopCpt)) + "px"; // 5

        this.setTransition();

        setTimeout(this.go, 10, newLoopCpt);
//        setTimeout(this.setTransition, 500);
    },

    animateL2R: function(diff) {
        var diff = diff || 0;

        if (diff === 0)
            newLoopCpt = this.state.loopCpt+1;
        else
            newLoopCpt = this.state.loopCpt+diff;

        console.log('NEXT >>');
        console.log('diff', diff)
        console.log('newLoopCpt', newLoopCpt)

        this.setState({
            loopCpt: newLoopCpt
        });
        console.log('loopCpt', this.state.loopCpt);
        this.setTransition();
        this.state.caroussel.style.webkitTransform = "translate3d(-" + (this.props.width * newLoopCpt) + "px,0px,0px)"; // 1
        setTimeout(this.infiniteCarousselL2R, this.props.transitionDelay*1000);
    },

    componentDidUpdate: function() {
        console.log('componentDidUpdate');
        console.log('loopCpt', this.state.loopCpt);
    },

    animateR2L: function(diff) {
        var diff = diff || 0;

        if (diff === 0)
            newLoopCpt = this.state.loopCpt-1;
        else
            newLoopCpt = this.state.loopCpt+diff;

        console.log('<< PREV');
        console.log('diff', diff)
        console.log('newLoopCpt', newLoopCpt)

        this.setState({
            loopCpt: newLoopCpt
        });
        console.log('loopCpt', this.state.loopCpt);

//        this.infiniteCarousselR2L(newLoopCpt);
        setTimeout(this.infiniteCarousselR2L, 50, newLoopCpt);
    },

    handleClick: function(idx) {
        this.stopInterval();
        console.log('[Caroussel] idx', idx);
        console.log('[Caroussel] ActiveIndicator', this.getActiveIndicator());
        var diff = parseInt(idx-this.getActiveIndicator(), 10);
        console.log('diff', diff);

//        var currentTranslation = this.props.width * this.state.loopCpt;
//        console.log('currentTranslation', currentTranslation);
//
//        var clicTranslation = this.props.width * diff;
//        console.log('clicTranslation', clicTranslation);
//
//        var newTranslation = (currentTranslation+clicTranslation);
//        console.warn('newTranslation', newTranslation);

        if (diff < 0) {
            this.animateR2L(diff);
        } else {
            this.animateL2R(diff);
        }

        this.startInterval();
    },

    getActiveIndicator: function() {
        return this.state.loopCpt % this.props.data.length
    },

    getIndicators: function() {
        if (this.props.showIndicators) {
            var liItems = this.props.data.map(function(content, idx) {
                return <BtnControl key={"itemIndicator-" + idx}
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
                        <input type="button" value="||" onClick={this.stopInterval} className="btn" />
                        <input type="button" value=">" onClick={this.startInterval} className="btn" />
                    </div>
        }
    },

    render: function() {
        var liItems = this.props.data.map(function(content, idx) {
            return <Diapositive key={"item-" + idx } width={this.props.width} content={content} idx={idx} />
        }.bind(this));

        return (
            <div>

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

var Diapositive = React.createClass({

    render: function() {
        return (
            <li style={{width: this.props.width}}>
                <div className="mod">
                    <img src={this.props.content.img} alt=""
                    className="left" />

                    <div className="legend left">
                        <h4 className="cUniv mbs txtUpp">{this.props.content.title}</h4>
                        <div className="descr">{this.props.content.descr}</div>
                    </div>
                </div>
            </li>
            );
    }

});

module.exports = Caroussel;
