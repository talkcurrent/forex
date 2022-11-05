const SirBCard = (props) => {
    const {
        bgc, color, gtc, gaf, border, gap, align, justify, bRadius,
        width, margin ,padding ,fSize, fFamily
    } = props

    const cardStyle={
        display: "grid",
        gridTemplateColumns: gtc,
        gridAutoFlow: gaf,
        gap: gap,
        background: bgc,
        color: color,
        alignItems: align,
        justifyItems: justify,
        border: border,
        width: width,
        margin: margin,
        padding: padding,
        fontSize: fSize,
        fontFamily: fFamily,
        borderRadius: bRadius,
    }

    return (
        <div style={cardStyle}>
            {props.children}
        </div>
    )
}

export default SirBCard
