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
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { ProductType } from 'Type/ProductList';
import { registerSharedElementDestination } from 'Store/SharedTransition/SharedTransition.action';
import ProductGallery, { IMAGE_TYPE } from './ProductGallery.component';

export const THUMBNAIL_KEY = 'small_image';
export const AMOUNT_OF_PLACEHOLDERS = 3;

export const mapDispatchToProps = dispatch => ({
    registerSharedElementDestination: elem => dispatch(registerSharedElementDestination(elem))
});

export class ProductGalleryContainer extends PureComponent {
    static propTypes = {
        registerSharedElementDestination: PropTypes.func.isRequired,
        product: ProductType.isRequired
    };

    containerFunctions = {
        onActiveImageChange: this.onActiveImageChange.bind(this),
        handleZoomChange: this.handleZoomChange.bind(this),
        disableZoom: this.disableZoom.bind(this)
    };

    constructor(props) {
        super(props);

        const { product: { id } } = props;

        this.state = {
            activeImage: 0,
            isZoomEnabled: false,
            prevProdId: id
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { product: { id } } = props;
        const { prevProdId } = state;
        if (prevProdId === id) return null;
        return { prevProdId: id, activeImage: 0 };
    }

    onActiveImageChange(activeImage) {
        this.setState({
            activeImage,
            isZoomEnabled: false
        });
    }

    getGalleryPictures() {
        const {
            product: {
                media_gallery_entries: mediaGallery = [],
                [THUMBNAIL_KEY]: { url } = {},
                name
            }
        } = this.props;

        if (mediaGallery.length) {
            return Object.values(mediaGallery.reduce((acc, srcMedia) => {
                const {
                    types,
                    position,
                    disabled
                } = srcMedia;

                const canBeShown = !disabled;
                if (!canBeShown) return acc;

                const isThumbnail = types.includes(THUMBNAIL_KEY);
                const key = isThumbnail ? 0 : position + 1;

                return {
                    ...acc,
                    [key]: srcMedia
                };
            }, {}));
        }

        if (!url) {
            return [{ type: 'image' }];
        }

        return [{
            thumbnail: { url },
            base: { url },
            id: THUMBNAIL_KEY,
            label: name,
            media_type: IMAGE_TYPE
        }, ...Array(AMOUNT_OF_PLACEHOLDERS).fill({ media_type: 'placeholder' })];
    }

    containerProps = () => {
        const { activeImage, isZoomEnabled } = this.state;
        const {
            product: { id: productId = -1 },
            registerSharedElementDestination
        } = this.props;

        return {
            registerSharedElementDestination,
            gallery: this.getGalleryPictures(),
            productName: this._getProductName(),
            activeImage,
            isZoomEnabled,
            productId
        };
    };

    /**
     * Returns the name of the product this gallery if for
     * @private
     */
    _getProductName() {
        const { product: { name } } = this.props;
        return name;
    }

    disableZoom() {
        document.body.classList.remove('overscrollPrevented');
        this.setState({ isZoomEnabled: false });
    }

    handleZoomChange(args) {
        const { isZoomEnabled } = this.state;

        if (args.scale !== 1) {
            if (isZoomEnabled) return;
            document.body.classList.add('overscrollPrevented');
            this.setState({ isZoomEnabled: true });
        }
    }

    render() {
        return (
            <ProductGallery
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(ProductGalleryContainer);
