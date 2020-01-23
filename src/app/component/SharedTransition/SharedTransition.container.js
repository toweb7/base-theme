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

import { connect } from 'react-redux';
import { cleanSharedTransition } from 'Store/SharedTransition/SharedTransition.action';
import SharedTransition from './SharedTransition.component';

export const mapStateToProps = state => ({
    startingPosition: state.SharedTransitionReducer.startingPosition,
    destinationPosition: state.SharedTransitionReducer.destinationPosition,
    isReadyForTransition: state.SharedTransitionReducer.isReadyForTransition
});

export const mapDispatchToProps = dispatch => ({
    cleanUpTransition: () => dispatch(cleanSharedTransition())
});

export default connect(mapStateToProps, mapDispatchToProps)(SharedTransition);
