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
//        console.log('[BtnControl] idx => ',this.props.idx)
//        console.log('[BtnControl] loopCpt => ',this.props.loopCpt)
//        this.setState({
//            isActive: true
//        });
        this.props.handleClick(this.props.idx);
        this.props.handleAcitvateDiapo();
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
            animationDelay: 5000,
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
            timer: setInterval(this.animate, this.props.animationDelay)
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

    infiniteCaroussel: function() {
        var first = this.state.caroussel.querySelector("li:first-child"); // 2

        this.deleteTransition();

        this.state.caroussel.appendChild(first); // 4
        this.state.caroussel.style.marginLeft = (this.props.width * this.state.loopCpt) + "px"; // 5

        setTimeout(this.setTransition, 500);
    },

    animate: function() {

        this.setState({
            loopCpt: this.state.loopCpt + 1
        });

        console.log('loopCpt', this.state.loopCpt);

        this.state.caroussel.style.webkitTransform = "translate3d(-" + (this.props.width * this.state.loopCpt) + "px,0px,0px)"; // 1

        setTimeout(this.infiniteCaroussel,1500);
    },

    handleClick: function(idx) {
        console.log('[Caroussel] idx', idx);
    },

    getActiveIndicator: function() {
        return this.state.loopCpt % this.props.data.length
    },

    handleAcitvateDiapo: function() {
        var diapo = this.props.idx % (this.props.loopCpt / this.props.nbItemTotal)
        console.log('diapo', diapo);
    },

    getIndicators: function() {
        if (this.props.showIndicators) {
            var liItems = this.props.data.map(function(content, idx) {
                return <BtnControl key={"itemIndicator-" + idx}
                                    idx={idx}
                                    loopCpt={this.state.loopCpt}
                                    nbItemTotal={this.props.data.length}
                                    handleClick={this.handleClick}
                                    handleAcitvateDiapo={this.handleAcitvateDiapo}/>
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
            return <li style={{width: this.props.width}} data-id={"diapo-"+idx} key={"item-"+idx}>
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

module.exports = Caroussel;
