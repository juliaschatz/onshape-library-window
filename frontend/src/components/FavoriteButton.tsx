import React, { Component } from "react";

import { ButtonBase } from "@material-ui/core";
import SvgFavoriteStrokeIcon from '../icons/SvgFavoriteStrokeIcon';
import FavoritesService from "../utils/favorites";
import { OnshapeInsertable } from "../utils/models/OnshapeInsertable";

type FavoriteProps = {
  element: OnshapeInsertable;
}

export default class FavoriteButton extends Component<FavoriteProps> {

  state = {
    filled: false
  }

  constructor(props: FavoriteProps) {
    super(props);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  componentDidMount() {
    let filledIn = this.favoritesService.isInFavorites(this.props.element);
    this.setState({filled: filledIn});
  }
  

  favoritesService: FavoritesService = FavoritesService.getInstance();
  
  private mouseEnter() {
    this.setState({filled: true})
  }
  
  private mouseLeave() {
    this.setState({filled: false || this.favoritesService.isInFavorites(this.props.element)});
  }

  private toggleFavorite(e: React.MouseEvent) {
    this.favoritesService.toggleFavorite(this.props.element);
    e.stopPropagation(); // Prevent clicking on this from triggering an insert
  }


  render() {
    const filled = this.state.filled;
    return (
      <ButtonBase onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.toggleFavorite}>
        <SvgFavoriteStrokeIcon filled={filled} fontSize="small" />
        {/* filled ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon color="inherit" /> */}
      </ButtonBase>
    )
  }
}