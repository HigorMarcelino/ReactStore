import { useState, useEffect } from 'react'

import styles from './Message.module.css'

//este componente será usado como meio de notificação para o usuário informando erros e sucessos das ações
function Message({ type, msg }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!msg) {
      setVisible(false)
      return
    }

    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [msg])

  return (
    <>
      {visible && (
        <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
      )}
    </>
  )
}

export default Message