export type Album = {
    type: string,
    cover: string,
    name: string,
    artist: string,
    last_week: number,
    peak_position: number,
    playcount: number,
    rank_position: number,
    total_weeks: number,
    weeks_on_top: number
}

export type Track = {
    type: string,
    artist: string,
    last_week: number,
    peak_position: number,
    playcount: number,
    rank_position: number,
    total_weeks: number,
    cover: string,
    name: string,
    weeks_on_top: number
}

export type Artist = {
    cover: string,
    artist: string,
    last_week: number,
    name: string,
    peak_position: number,
    playcount: number,
    rank_position: number,
    total_weeks: number,
    type: 'artist',
    weeks_on_top: number
}

export type User = {
    album_numbers: number,
    artist_numbers: number,
    image: string,
    name: string,
    playcount: number,
    total_weeks: number,
    track_numbers: number
}

export type Chart = {
    cover: string,
    metric_type: string,
    name: string,
    rank: number,
    secondary_name: string | null
    type: string,
    value: number
}

export type ChartRunItem = {
    start_date: string,
    end_date: string,
    rank_position: number,
    playcount: number
}

export type AlbumChartData = {
    name: string,
    artist: string,
    cover: string,
    weeks_at_1: number,
    weeks_at_3: number,
    weeks_at_5: number,
    weeks_at_10: number,
    peak_position: number,
    debut_date: string,
    total_weeks: number,
    chart_run: ChartRunItem[];
}