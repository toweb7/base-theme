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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './SharedTransition.style';


class SharedTransition extends PureComponent {
    static propTypes = {
        isReadyForTransition: PropTypes.bool.isRequired
    };

    render() {
        const { isReadyForTransition: isVisible } = this.props;

        return (
            <div
              block="SharedTransition"
              mods={ { isVisible } }
              id="shared-element-wrapper"
            />
        );
    }
}

export default SharedTransition;
