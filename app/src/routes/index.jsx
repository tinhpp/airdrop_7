import HomePage from '@src/pages';
import UserLayout from '@src/components/layouts';
import HistoryPage from '@src/pages/profile/history';
import AssetsPage from '@src/pages/profile/assets';
import CollateralsPage from '@src/pages/profile/collaterals';
import HeaderBanner from '@src/components/layouts/header-banner';
import BorrowAssetsPage from '@src/pages/borrow/assets';
import BorrowLoansPage from '@src/pages/borrow/loans';
import BorrowOffersPage from '@src/pages/borrow/offers';
import BorrowRequestsPage from '../pages/borrow/requests';
import LendAssetsPage from '@src/pages/lend/assets';
import LendLoansPage from '@src/pages/lend/loans';
import LendOffersPage from '@src/pages/lend/offers';
import LendRequestsPage from '../pages/lend/requests';
import MakeOfferPage from '@src/pages/assets/make-offer';
import LendingPoolPage from '@src/pages/lending-pool';
import LendingPoolRequestsPage from '@src/pages/lending-pool/requests';
import ExchangePage from '@src/pages/market/exchange';
import AdminCollectionsPage from '@src/pages/admin/collections';
import { BORROW_TABS, LEND_TABS, LENDING_POOL_TABS, PROFILE_TABS, ADMIN_TABS } from '@src/constants';
import Marketplace from '@src/components/marketplace';
import TokenDetail from '@src/components/marketplace/token';
import { Create } from '@src/components/marketplace/create';
import TokenDetailProvider from '@src/components/marketplace/token/provider';

export const userRoutes = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/profile',
        element: <HeaderBanner tabs={PROFILE_TABS} />,
        children: [
          {
            path: '/profile/history',
            element: <HistoryPage />,
          },
          {
            path: '/profile/assets',
            element: <AssetsPage />,
          },
          {
            path: '/profile/collaterals',
            element: <CollateralsPage />,
          },
        ],
      },
      {
        path: '/borrow',
        element: (
          <HeaderBanner
            title="Get a loan"
            description="Put your NFT assets up as collateral for a loan."
            tabs={BORROW_TABS}
          />
        ),
        children: [
          {
            path: '/borrow/assets',
            element: <BorrowAssetsPage />,
          },
          {
            path: '/borrow/loans',
            element: <BorrowLoansPage />,
          },
          {
            path: '/borrow/offers',
            element: <BorrowOffersPage />,
          },
          {
            path: '/borrow/requests',
            element: <BorrowRequestsPage />,
          },
        ],
      },
      {
        path: '/lend',
        element: (
          <HeaderBanner
            title="Give a loan"
            description="Offer loans to other users on their non-fungible tokens."
            tabs={LEND_TABS}
          />
        ),
        children: [
          {
            path: '/lend/assets',
            element: <LendAssetsPage />,
          },
          {
            path: '/lend/loans',
            element: <LendLoansPage />,
          },
          {
            path: '/lend/offers',
            element: <LendOffersPage />,
          },
          {
            path: '/lend/requests',
            element: <LendRequestsPage />,
          },
        ],
      },
      {
        path: '/lending-pool',
        element: (
          <HeaderBanner
            title="Lending Pool"
            description="Stake your wXCR and receive rewards."
            right={false}
            tabs={LENDING_POOL_TABS}
          />
        ),
        children: [
          {
            path: '/lending-pool',
            element: <LendingPoolPage />,
          },
          {
            path: '/lending-pool/requests',
            element: <LendingPoolRequestsPage />,
          },
        ],
      },
      {
        path: '/assets/:hash',
        element: <MakeOfferPage />,
      },
      {
        path: '/exchange',
        element: <ExchangePage />,
      },
      {
        path: '/admin',
        element: <HeaderBanner tabs={ADMIN_TABS} />,
        children: [
          {
            path: '/admin/collections',
            element: <AdminCollectionsPage />,
          },
        ],
      },
      {
        path: '/marketplace',
        children: [
          {
            path: '',
            element: <Marketplace />,
          },
          {
            path: 'create',
            element: <Create />,
          },
        ],
      },
      {
        path: '/token/:hash',
        element: (
          <TokenDetailProvider>
            <TokenDetail />
          </TokenDetailProvider>
        ),
      },
    ],
  },
];
