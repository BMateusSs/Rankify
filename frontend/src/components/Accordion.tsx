import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { fonts } from '../style'

type AccordionProps = {
  children: React.ReactNode
  initiallyVisible?: boolean
  title: string
  onToggle?: (visible: boolean) => void
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  initiallyVisible = true,
  onToggle,
}) => {
  const [visible, setVisible] = useState<boolean>(initiallyVisible)

  const toggle = () => {
    const newValue = !visible
    setVisible(newValue)
    if (onToggle) onToggle(newValue)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.icon}>{visible ? '×' : '+'}</Text>
        </View>
      </TouchableOpacity>

      {visible && <View style={styles.content}>{children}</View>}
    </View>
  )
}

export default Accordion

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 5,
  },
  header: {
    height: 50,
    width: '100%',
    backgroundColor: 'blue',
    //borderTopLeftRadius: 10,
    //borderTopRightRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.mainFont,
    color: '#fff',
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  icon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    borderWidth: 1,
    borderColor: 'blue',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 20,
  },
})
