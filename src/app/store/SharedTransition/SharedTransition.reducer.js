/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import {
    REGISTER_SHARED_ELEMENT,
    REGISTER_SHARED_ELEMENT_DESTINATION,
    CLEANUP_SHARED_TRANSITION
} from './SharedTransition.action';

export const initialState = {
    isReadyForTransition: false,
    sharedElementDestination: null,
    sharedElement: null,
    destinationPosition: {},
    startingPosition: {}
};

export const parseRectangle = val => JSON.parse(JSON.stringify(val));

export const SHARED_ELEMENT_TRANSITION = 250;

export class SharedTransition {
    constructor(props) {
        this.props = props;
        this.sharedContainer = document.getElementById('shared-element-wrapper');
    }

    animationSpeed = SHARED_ELEMENT_TRANSITION;

    setDestinationTransform = this.setTransform.bind(this, 'destinationPosition');

    setStartingTransform = this.setTransform.bind(this, 'startingPosition');

    setTransform(key) {
        const {
            [key]: {
                width,
                height,
                left,
                top
            }
        } = this.props;

        this.sharedContainer.style.cssText = `
            --shared-element-width: ${width}px;
            --shared-element-height: ${height}px;
            --shared-element-top: ${top}px;
            --shared-element-left: ${left}px;
            --shared-element-animation-speed: ${this.animationSpeed}ms;
        `;
    }

    cleanUpTransition = () => {
        const { cleanUpTransition } = this.props;

        const range = document.createRange();
        range.selectNodeContents(this.sharedContainer);
        range.deleteContents();

        this.transitionInAction = false;
        cleanUpTransition();
    };

    updateSharedElement() {
        const { isReadyForTransition, sharedElement } = this.props;

        if (!isReadyForTransition || !this.sharedContainer) {
            return;
        }

        this.transitionInAction = true;
        this.setStartingTransform();

        // Transition wrapper is needed to prevent the CSS properties conflicting
        const transitionWrapper = document.createElement('div');
        transitionWrapper.appendChild(sharedElement);
        this.sharedContainer.appendChild(transitionWrapper);

        // setTimeout(this.setDestinationTransform, 0);
        // setTimeout(this.cleanUpTransition, this.animationSpeed);
    }
}

const SharedTransitionReducer = (state = initialState, action) => {
    const { type, element: { current } = {} } = action;
    const { startingPosition } = state;

    switch (type) {
    case REGISTER_SHARED_ELEMENT:
        if (!current) return state;

        return {
            ...state,
            startingPosition: parseRectangle(current.getBoundingClientRect())
        };

    case REGISTER_SHARED_ELEMENT_DESTINATION:
        if (!current) return state;

        const isReadyForTransition = !!Object.keys(startingPosition).length;

        const newState = {
            ...state,
            destinationPosition: parseRectangle(current.getBoundingClientRect()),
            isReadyForTransition
        };

        const transition = new SharedTransition(newState);
        transition.updateSharedElement();

        return newState;

    case CLEANUP_SHARED_TRANSITION:
        return initialState;

    default:
        return state;
    }
};

export default SharedTransitionReducer;
