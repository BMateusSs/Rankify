export const BASE_URL = 'http://192.168.0.100:5000'

export const endpoints = {
    charts: {
        weekly_albums: '/charts/weekly_albums',
        weekly_tracks: '/charts/weekly_tracks',
        weekly_artists: '/charts/weekly_artists',
        charts_infos: '/charts/chart_infos',
        charts_data: '/charts/charts_data',
        highest_playcount: '/charts/highest_playcount',
        chart_track_data: '/charts/chart_track_data',
        chart_artist_data: '/charts/chart_artist_data',
        get_weeks: '/charts/get_weeks',
        get_recent_week: '/charts/recent_week',
        get_top_weekly_albums: '/charts/top_weekly_albums',
        get_top_weekly_tracks: '/charts/top_weekly_tracks'
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
    GET_CHARTS_DATA: buildApiUrl(endpoints.charts.charts_data),
    GET_HIGHEST_PLAYCOUNT: buildApiUrl(endpoints.charts.highest_playcount),
    GET_TRACK_CHART_DATA: buildApiUrl(endpoints.charts.chart_track_data),
    GET_ARTIST_CHART_DATA: buildApiUrl(endpoints.charts.chart_artist_data),
    GET_WEEKS: buildApiUrl(endpoints.charts.get_weeks),
    GET_RECENT_WEEK: buildApiUrl(endpoints.charts.get_recent_week),
    GET_TOP_WEEKLY_ALBUMS: buildApiUrl(endpoints.charts.get_top_weekly_albums),
    GET_TOP_WEEKLY_TRACKS: buildApiUrl(endpoints.charts.get_top_weekly_tracks)
}
