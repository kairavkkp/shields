'use strict'

const { starRating } = require('../text-formatters')
const { floorCount } = require('../color-formatters')
const VisualStudioMarketplaceBase = require('./visual-studio-marketplace-base')

module.exports = class VisualStudioMarketplaceRating extends VisualStudioMarketplaceBase {
  static get category() {
    return 'rating'
  }

  static get route() {
    return {
      base: '',
      pattern:
        '(visual-studio-marketplace|vscode-marketplace)/:format(r|stars)/:extensionId',
    }
  }

  static get examples() {
    return [
      {
        title: 'Visual Studio Marketplace Rating',
        pattern: 'visual-studio-marketplace/r/:extensionId',
        namedParams: { extensionId: 'ritwickdey.LiveServer' },
        staticPreview: this.render({
          format: 'r',
          averageRating: 4.79,
          ratingCount: 145,
        }),
        keywords: this.keywords,
      },
      {
        title: 'Visual Studio Marketplace Rating (Stars)',
        pattern: 'visual-studio-marketplace/stars/:extensionId',
        namedParams: { extensionId: 'ritwickdey.LiveServer' },
        staticPreview: this.render({
          format: 'stars',
          averageRating: 4.5,
        }),
        keywords: this.keywords,
      },
    ]
  }

  static get defaultBadgeData() {
    return {
      label: 'rating',
    }
  }

  static render({ format, averageRating, ratingCount }) {
    const message =
      format === 'r'
        ? `${averageRating.toFixed(1)}/5 (${ratingCount})`
        : starRating(averageRating)
    return {
      message,
      color: floorCount(averageRating, 2, 3, 4),
    }
  }

  async handle({ format, extensionId }) {
    const json = await this.fetch({ extensionId })
    const { statistics } = this.transformStatistics({ json })
    return this.constructor.render({
      format,
      averageRating: statistics.averagerating,
      ratingCount: statistics.ratingcount,
    })
  }
}
