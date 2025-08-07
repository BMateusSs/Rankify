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
        get_top_weekly_tracks: '/charts/top_weekly_tracks',
        get_top_weekly_artists: '/charts/top_weekly_artists',
        get_top_album_overall: '/charts/top_albums_overall',
        get_top_track_overall: '/charts/top_tracks_overall',
        get_top_artist_overall: '/charts/top_artists_overall',
        get_artist_albums_data: '/charts/get_artist_albums_data',
        get_artist_tracks_data: '/charts/get_artist_tracks_data',
        
    },

    user: {
        user_info: '/charts/user_info'
    },

    emblems: {
        get_100_playcount_emblems: '/emblems/get_100_playcount_emblem',
        get_1000_playcount_emblems: '/emblems/get_1000_playcount_emblem',
        get_52_weeks_emblems: '/emblems/get_52_weeks_emblem',
        get_5_weeks_at_one: '/emblems/get_5_weeks_number_one_emblem',
        get_debut_at_one_emblems: '/emblems/get_debut_at_one_emblem',
        get_ranking_albums_emblems: '/emblems/get_ranking_albums_emblem',
        get_ranking_tracks_emblems: '/emblems/get_ranking_tracks_emblem',
        get_max_album_emblems: '/emblems/get_max_ranking_albums_emblem'
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
    GET_TOP_WEEKLY_TRACKS: buildApiUrl(endpoints.charts.get_top_weekly_tracks),
    GET_TOP_WEEKLY_ARTISTS: buildApiUrl(endpoints.charts.get_top_weekly_artists),
    GET_TOP_ALBUMS_OVERALL: buildApiUrl(endpoints.charts.get_top_album_overall),
    GET_TOP_TRACKS_OVERALL: buildApiUrl(endpoints.charts.get_top_track_overall),
    GET_TOP_ARTISTS_OVERALL: buildApiUrl(endpoints.charts.get_top_artist_overall),
    GET_ARTIST_ALBUMS_DATA: buildApiUrl(endpoints.charts.get_artist_albums_data),
    GET_ARTIST_TRACKS_DATA: buildApiUrl(endpoints.charts.get_artist_tracks_data),
    GET_100_PLAYCOUNT_EMBLEM: buildApiUrl(endpoints.emblems.get_100_playcount_emblems),
    GET_1000_PLAYCOUNT_EMBLEM: buildApiUrl(endpoints.emblems.get_1000_playcount_emblems),
    GET_52_WEEKS_EMBLEM: buildApiUrl(endpoints.emblems.get_52_weeks_emblems),
    GET_5_WEEKS_AT_ONE_EMBLEM: buildApiUrl(endpoints.emblems.get_5_weeks_at_one),
    GET_DEBUT_AT_ONE_EMBLEM: buildApiUrl(endpoints.emblems.get_debut_at_one_emblems),
    GET_RANKING_ALBUMS_EMBLEMS: buildApiUrl(endpoints.emblems.get_ranking_albums_emblems),
    GET_RANKING_TRACKS_EMBLEMS: buildApiUrl(endpoints.emblems.get_ranking_tracks_emblems),
    GET_MAX_ALBUMS_EMBLEMS: buildApiUrl(endpoints.emblems.get_max_album_emblems)
}
