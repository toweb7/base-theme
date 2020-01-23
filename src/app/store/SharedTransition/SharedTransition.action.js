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

export const REGISTER_SHARED_ELEMENT = 'REGISTER_SHARED_ELEMENT';
export const CLEANUP_SHARED_TRANSITION = 'REGISTER_SHARED_ELEMENT';
export const REGISTER_SHARED_ELEMENT_DESTINATION = 'REGISTER_SHARED_ELEMENT_DESTINATION';

export const cleanSharedTransition = () => ({
    type: CLEANUP_SHARED_TRANSITION
});

export const registerSharedElement = element => ({
    type: REGISTER_SHARED_ELEMENT,
    element
});

export const registerSharedElementDestination = element => ({
    type: REGISTER_SHARED_ELEMENT_DESTINATION,
    element
});
