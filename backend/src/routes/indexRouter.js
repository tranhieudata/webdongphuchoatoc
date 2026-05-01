import express from 'express'
import { ProductRoute } from './productRoutes.js';
import { UserRoute } from './userRoutes.js';
import { AuthRoute } from './authRoutes.js';
import { CategoryRoute } from './categoryRoutes.js';
import { TagRoute } from './TagRoutes.js';
import { BannerRoute } from './bannerRoutes.js';
import { NewsRoute } from './newsRoutes.js';
import { FabricSampleRoute } from './fabricSampleRoutes.js';
import { SizeChartRoute } from './sizeChartRoutes.js';

function router(app) {

    app.use('/uploads', express.static('uploads'))

    app.use('/api/product', ProductRoute)
    app.use('/api/users', UserRoute)
    app.use('/api/auth', AuthRoute)
    app.use('/api/category', CategoryRoute)
    app.use('/api/tag', TagRoute)
    app.use('/api/banner', BannerRoute)
    app.use('/api/news', NewsRoute)
    app.use('/api/fabric-sample', FabricSampleRoute)
    app.use('/api/size-chart', SizeChartRoute)
}
export {router}

