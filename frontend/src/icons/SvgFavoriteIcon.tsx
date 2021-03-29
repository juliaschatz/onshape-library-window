import React, { Component } from "react";

import { SvgIcon } from "@material-ui/core";
import FavoritesService from "../utils/favorites";

type FavoriteState = {
    elementId: string
}

export default class SvgFavoriteIcon extends Component<FavoriteState> {

    state = {
        filled: false
    }

    constructor(props: FavoriteState) {
        super(props);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.toggleFavorite = this.toggleFavorite.bind(this);
    }

    componentDidMount() {
        let filledIn = this.favoritesService.isInFavorites(this.props.elementId);
        this.setState({filled: filledIn});
    }
    

    favoritesService: FavoritesService = FavoritesService.getInstance();

    private mouseEnter() {
        this.setState({filled: true})
    }
    
    private mouseLeave() {
        this.setState({filled: false || this.favoritesService.isInFavorites(this.props.elementId)});
    }

    private toggleFavorite() {
        this.favoritesService.toggleFavorite(this.props.elementId);
    }


    render() {
        const filled = this.state.filled;
        return (
            <div onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.toggleFavorite}>
                { filled && 
                    <SvgIcon width="24" height="24" viewBox="0 0 24 24" className='favorite-icon'>
                        <g>
                            <rect fill="none" height="24" width="24" x="0"/>
                            <polygon points="14.43,10 12,2 9.57,10 2,10 8.18,14.41 5.83,22 12,17.31 18.18,22 15.83,14.41 22,10"/>
                        </g>
                    </SvgIcon> 
                }

                { !filled && 
                    <SvgIcon width="24" height="24" viewBox="0 0 24 24" className='favorite-icon'>
                    <g>
                        <rect fill="none" height="24" width="24" x="0"/>
                        <path d="M12,8.89L12.94,12h2.82l-2.27,1.62l0.93,3.01L12,14.79l-2.42,1.84l0.93-3.01L8.24,12h2.82L12,8.89 M12,2l-2.42,8H2 l6.17,4.41L5.83,22L12,17.31L18.18,22l-2.35-7.59L22,10h-7.58L12,2L12,2z"/>
                    </g>
                    </SvgIcon>
                }

            </div>
        )
    }
}