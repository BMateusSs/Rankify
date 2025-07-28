export const BASE_URL = 'http://192.168.0.112:5000'

export const endpoints = {
    charts: {
        weekly_albums: '/charts/weekly_albums',
        weekly_tracks: '/charts/weekly_tracks',
        weekly_artists: '/charts/weekly_artists',
        charts_infos: '/charts/chart_infos',
        charts_data: '/charts/charts_data'
    },

    user: {
        user_info: '/charts/user_info'
    }
}

export const buildApiUrl = (endpoint: string): string => {
    return `${BASE_URL}${endpoint}`
}

export const API_URLS = {
    GET_WEEKLY_ALBUMS: buildApiUrl(endpoints.charts.weekly_albums),
    GET_WEEKLY_TRACKS: buildApiUrl(endpoints.charts.weekly_tracks),
    GET_WEEKLY_ARTISTS: buildApiUrl(endpoints.charts.weekly_artists),
    GET_USER_INFOS: buildApiUrl(endpoints.user.user_info),
    GET_CHART_INFOS: buildApiUrl(endpoints.charts.charts_infos),
    GET_CHARTS_DATA: buildApiUrl(endpoints.charts.charts_data)
}
