function Footer({ lang }) {
  const rights = lang === 'zh' ? '保留所有权利。' : 'All rights reserved.'
  const byline = lang === 'zh' ? '由 theMixo 制作' : 'Crafted by theMixo'

  return (
    <footer className="site-footer">
      <div className="container-shell footer-row">
        <p>
          © {new Date().getFullYear()} MixoCore. {rights}
        </p>
        <p>{byline}</p>
      </div>
    </footer>
  )
}

export default Footer
