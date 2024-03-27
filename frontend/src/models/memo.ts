export interface MemoType {
    id?: String,
    name: String,
    description: String,
    date: String,
    location: {
        name: String,
        coordinates: [Number, Number]
    },
    media?: String[]
    tags?: String[]
}