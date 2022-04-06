import React, { Component } from 'react';

export class ImageComp extends Component {
    static displayName = ImageComp.name;

    constructor(props) {
        super(props);
        this.state = { imageData: props.imageData };
    }
    render() {
        return (
            <div className="ImageMain">
                <div className="ImageContainer"><img src={this.props.imageData.url} /></div>
                <div className="ImageTitle"><span>{this.props.imageData.title}</span></div>
            </div>
        );
    }

}
