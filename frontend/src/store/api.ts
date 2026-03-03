import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import keycloak from '../keycloak';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api',
        prepareHeaders: (headers) => {
            if (keycloak.token) {
                headers.set('authorization', `Bearer ${keycloak.token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['PowerCuts', 'Subscriptions'],
    endpoints: (builder) => ({
        getPowerCuts: builder.query({
            query: (params) => ({
                url: '/powercuts',
                params,
            }),
            providesTags: ['PowerCuts'],
        }),
        createPowerCut: builder.mutation({
            query: (body) => ({
                url: '/powercuts',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['PowerCuts'],
        }),
        updatePowerCut: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/powercuts/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['PowerCuts'],
        }),
        deletePowerCut: builder.mutation({
            query: (id) => ({
                url: `/powercuts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['PowerCuts'],
        }),
        getSubscriptions: builder.query({
            query: () => '/subscriptions',
            providesTags: ['Subscriptions'],
        }),
        subscribeTopic: builder.mutation({
            query: (body) => ({
                url: '/subscriptions',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Subscriptions'],
        }),
        unsubscribeTopic: builder.mutation({
            query: (id) => ({
                url: `/subscriptions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Subscriptions'],
        }),
    }),
});

export const {
    useGetPowerCutsQuery,
    useCreatePowerCutMutation,
    useUpdatePowerCutMutation,
    useDeletePowerCutMutation,
    useGetSubscriptionsQuery,
    useSubscribeTopicMutation,
    useUnsubscribeTopicMutation,
} = api;
